import {Component, ElementRef, Injector, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {LOAI_PHIEU, LOAI_SAN_PHAM, RECORD_STATUS} from "../../../../constants/config";
import {DrugAddEditDialogComponent} from "../../../drug/drug-add-edit-dialog/drug-add-edit-dialog.component";
import {PaymentTypeService} from "../../../../services/categories/payment-type.service";
import {KhachHangService} from "../../../../services/customer/khach-hang.service";
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { SETTING } from '../../../../constants/setting';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CustomerAddEditDialogComponent } from '../../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { TransactionDetailByObjectDialogComponent } from '../../../transaction/transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { DatePipe } from '@angular/common';
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';

@Component({
  selector: 'return-from-customer-note-screen',
  templateUrl: './return-from-customer-note-screen.component.html',
  styleUrls: ['./return-from-customer-note-screen.component.css'],
})
export class ReturnFromCustomerNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu trả lại từ khách hàng";
  listThuoc$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  debtValue: number = 0;
  debtLabel: string = 'Còn nợ';
  khachHang: any = {};
  listPaymentType : any[] = [];

  // Settings
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON).activated;
  displayImageProduct = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS).activated;

  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : PhieuNhapService,
    private khachHangService : KhachHangService,
    private thuocService : ThuocService,
    private paymentTypeService : PaymentTypeService,
    private datePipe: DatePipe,
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      id : [0],
      soPhieuNhap : [],
      noteNumber : [],
      noteDate : [],
      khachHangMaKhachHang : [],
      idWarehouseLocation : [],
      invoiceNo : [],
      invoiceDate : [],
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP_TU_KH,
      tongTien : [0],
      vat : [],
      daTra : [0],
      discount : [0],
      discountWithRatio : [],
      dienGiai : [''],
      ngayNhap : [],
      paymentTypeId : [0],
      locked: [false]
    });
  }

  getDisplayedColumns() {
    var val = ['#', 'stt', 'img', 'tenThuoc', 'donVi', 'soLuong', 'giaBan', 'ck', 'thanhTien'];
    if (this.isMobile()) {
      val = val.filter(e => e !== 'stt' && e !== 'img' && e !== 'giaBan' && e !== 'ck');
    }
    if (!this.displayImageProduct) {
      val = val.filter(e => e !== 'img');
    }
    return val;
  }


  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.dataTable.push({ isEditing: true });
    await this.getDataFilter();
    this.getId();
    if (this.idUrl) {
      const data = await this.detail(this.idUrl);
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
      data.chiTiets.forEach((item: any) => {
        item.isEditing = false;
        item.listDonViTinhs = item.thuocs.listDonViTinhs;
        item.tenThuoc = item.thuocs.tenThuoc;
        item.maThuoc = item.thuocs.maThuoc;
        item.heSo = item.heSo > 0 ? item.heSo : 1;
        item.tonKho = item.thuocs.inventory?.lastValue;
      });
      this.dataTable.push(...data.chiTiets);
    }
    else {
      let body = {
        loaiXuatNhapMaLoaiXuatNhap: LOAI_PHIEU.PHIEU_NHAP_TU_KH,
        id: null
      }
      this.service.init(body).then((res) => {
        if (res && res.data) {
          const data = res.data;
          this.formData.patchValue({
            ngayNhap: data.ngayNhap,
            soPhieuNhap: data.soPhieuNhap,
          })
        }
      });
    }
  }

  async getDataFilter() {
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.getMaNhaThuocCha() != '' && this.getMaNhaThuocCha() != null ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
            typeService: LOAI_SAN_PHAM.THUOC
          };
          return from(this.thuocService.searchPage(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data.content;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
    // Search khách hàng
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.useCustomerCommon ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
          };
          return from(this.khachHangService.searchPage(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data.content;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
    //payment type
    this.loadDataOpt();
  }

  loadDataOpt(){
    this.paymentTypeService.searchList({}).then((res)=>{
      this.listPaymentType = res?.data;
    });
  }

  isShow = true;
  showOption(){
    this.isShow = !this.isShow;
  }

  onChangeThuoc($event: any) {
    if ($event) {
      this.thuocService.getDetail($event.id).then((res) => {
        if (res && res.data) {
          const data = res.data;
          this.dataTable[0].thuocThuocId = data.id;
          this.dataTable[0].maThuoc = data.maThuoc;
          this.dataTable[0].tenThuoc = data.tenThuoc;
          this.dataTable[0].soLuong = 1;
          this.dataTable[0].giaNhap = data.heSo > 1 ? data.giaBanLe * data.heSo : data.giaBanLe;
          this.dataTable[0].giaBanLe = data.heSo > 1 ? data.giaBanLe * data.heSo : data.giaBanLe;
          this.dataTable[0].rateRevenue = data.giaNhap > 0 ? ((data.giaBanLe - data.giaNhap) / data.giaNhap) * 100 : 0;
          this.dataTable[0].donViTinhMaDonViTinh = data.heSo > 1 ? data.donViThuNguyenMaDonViTinh : data.donViXuatLeMaDonViTinh;
          this.dataTable[0].listDonViTinhs = data.listDonViTinhs;
          this.dataTable[0].donViXuatLeMaDonViTinh = data.donViXuatLeMaDonViTinh;
          this.dataTable[0].donViThuNguyenMaDonViTinh = data.donViThuNguyenMaDonViTinh;
          this.dataTable[0].imagePreviewUrl = data.imagePreviewUrl;
          this.dataTable[0].heSo = data.heSo > 1 ? data.heSo : 1;
          this.dataTable[0].isModified = false;
          this.dataTable[0].isProdRef = false;
          this.dataTable[0].recordStatusId = 0;
          this.dataTable[0].referenceId = 0;
          this.dataTable[0].retailPrice = 0;
          this.dataTable[0].retailQuantity = 0;
          this.dataTable[0].storeId = 0;
          this.dataTable[0].chietKhau = 0;
          this.dataTable[0].vat = 0;
          this.dataTable[0].connectivityStatusId = 0;
          this.dataTable[0].tonKho = data.heSo > 1 ? data.inventory?.lastValue / data.heSo : data.inventory?.lastValue;
          console.log(this.dataTable[0]);
          this.getItemAmount(this.dataTable[0]);
          this.focusInputSoLuong();
        }
      })
    }
  }

  async onAddNew(item: any) {
    //kiểm tra đã có thuốc chưa
    if (!item.thuocThuocId) {
      this.notification.error(MESSAGE.ERROR, "Hãy chọn thuốc thêm vào phiếu");
      return;
    }
    if (item.isEditing) {
      let isExsit = false;
      this.dataTable.filter(x => !x.isEditing).forEach(x => {
        if (x.thuocThuocId == item.thuocThuocId && x.donViTinhMaDonViTinh == item.donViTinhMaDonViTinh && x.giaXuat == item.giaXuat) {
          //cong so luong
          x.soLuong = x.soLuong + item.soLuong;
          isExsit = true;
        }
      });
      if (!isExsit) {
        item.isEditing = false;
        item.itemOrder = this.dataTable.filter(x => !x.isEditing).length;
        this.dataTable.push(item);
      }
      this.dataTable[0] = { isEditing: true };
      this.updateTotal();
      setTimeout(() => this.focusSearchDrug(), 100);
    }
  }

  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  async focusSearchDrug() {
    this.selectDrug?.focus();
  }

  @ViewChildren('inputSoLuong') inputSoLuongs!: QueryList<ElementRef>;
  async focusInputSoLuong() {
    if (this.inputSoLuongs.last) {
      this.inputSoLuongs.last.nativeElement.focus();
    }
  }

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaNhap = item.giaNhap / item.heSo;
      item.giaBanLe = item.giaBanLe / item.heSo;
      item.tonKho = item.tonKho * item.heSo;
    } else {
      item.giaNhap = item.giaNhap * item.heSo;
      item.giaBanLe = item.giaBanLe * item.heSo;
      item.tonKho = item.tonKho / item.heSo;
    }
    this.getItemAmount(item);
    this.updateTotal();
  }

  async updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditing)
      .reduce((acc, val) => acc += (val.tongTien), 0));
    let discount = this.formData.get('discount')?.value;
    let totalAmount = this.formData.get('tongTien')?.value;
    this.formData.controls['daTra'].setValue(totalAmount - discount);
  }

  async getItemAmount(item: any) {
    let discount = (item.giaBanLe > 0.05 ? (item.chietKhau / item.giaBanLe) : 0) * 100;
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaBanLe * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
    item.retailQuantity = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.soLuong : item.soLuong * item.heSo;
    item.retailOutPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaBanLe : item.giaBanLe / item.heSo;
    item.giaNhap = item.giaBanLe;
    item.retailPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaNhap : item.giaNhap / item.heSo;
    this.updateTotal();
  }

  getDebtAmount() {
    let totalAmount = Number(this.formData.get('tongTien')?.value);
    let paymentAmount = Number(this.formData.get('daTra')?.value);
    let discount = Number(this.formData.get('discount')?.value);
    this.debtValue = Number(totalAmount - (paymentAmount + discount));
    this.debtLabel = this.debtValue < 0 ? 'Tiền thừa' : 'Còn nợ';
    return this.debtValue < 0 ? -this.debtValue : this.debtValue;
  }

  async onLockNote() {
    let locked = this.formData.get('locked')?.value;
    const res = locked ? await this._service.unlock({ id: this.formData.get('id')?.value }) : await this._service.lock({ id: this.formData.get('id')?.value });
    if (res && res.status == STATUS_API.SUCCESS) {
      this.formData.controls['locked'].setValue(res.data.locked);
      this.notification.success(MESSAGE.SUCCESS, this.formData.get('locked')?.value ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  onDelete(data: any) {
    var index = this.dataTable.indexOf(data);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
      let order = 1;
      this.dataTable.filter(x => !x.isEditing).forEach(x => {
        x.itemOrder = order;
        order++;
      });
    }
    this.updateTotal();
  }

  async onPaymentFull() {
    let totalAmount = this.formData.get('tongTien')?.value;
    let discount = this.formData.get('discount')?.value;

    var paymentAmount = Math.round(totalAmount - discount);
    if (paymentAmount < 0.5) {
      paymentAmount = 0;
    }
    this.formData.controls['daTra'].setValue(paymentAmount);
  }

  async onChangeCustomer($event: any){
    if($event){
      this.khachHang = $event;
    }
  }

  async createUpdate() {
    if (this.dataTable.filter(x => x.thuocThuocId > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    if (this.dataTable.length == 1 && this.dataTable[0].isEditing) {
      await this.onAddNew(this.dataTable[0])
    }
    body.chiTiets = this.dataTable.filter(x => x.thuocThuocId > 0);
    this.save(body).then(data => {
      if (data) {
        if (this.idUrl > 0) {
          this.router.navigate(['/management/note-management/list'],
            { queryParams: { noteTypeId: LOAI_PHIEU.PHIEU_NHAP_TU_KH } });
        } else {
          this.router.navigate(['/management/note-management/return-from-customer-note-detail', data.id],
            { queryParams: { isContinue: true } });
        }
      }
    });
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  trackByFn(item: any) {
    return item.id;
  }

  @ViewChildren('pickerNgayNhap') pickerNgayNhap!: Date;
  async onDateChange(date: Date) {
    let noteDate = this.formData.get('noteDate')?.value;
    this.formData.controls['ngayNhap'].setValue(this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '');
  }

  async openCustomerAddEditDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.listKhachHang$ = of([result]);
        this.formData.patchValue({ nhaCungCapMaNhaCungCap: result.id });
      }
    });
  }

  async openAddDrugDialog() {
    const dialogRef = this.dialog.open(DrugAddEditDialogComponent, {
      data: 0,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.onChangeThuoc(result);
      }
    });
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async openTransaction() {
    if (this.formData.value?.khachHangMaKhachHang > 0) {
      var data = {
        id: this.khachHang?.id,
        name: this.khachHang?.tenKhachHang,
        typeId : LOAI_PHIEU.PHIEU_NHAP_TU_KH
      };
      const dialogRef = this.dialog.open(TransactionDetailByObjectDialogComponent, {
        data: data,
        width: '90%',
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn khách hàng');
    }
  }

  getInputSize() {
    var val = this.isMobile() ? 'input-sm' : '';
    return val;
  };

  getInputFontSize() {
    var val = this.isMobile() ? '10px' : '14px';
    return val;
  };

  getBtnSize() {
    var val = this.isMobile() ? 'btn-sm' : '';
    return val;
  };

}
