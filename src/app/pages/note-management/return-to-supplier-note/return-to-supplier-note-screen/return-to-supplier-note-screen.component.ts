import { Component, ElementRef, HostListener, Injector, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { NhaCungCapService } from '../../../../services/categories/nha-cung-cap.service';
import { ThuocService } from '../../../../services/products/thuoc.service';
import { LOAI_PHIEU, LOAI_SAN_PHAM } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { DatePipe } from '@angular/common';
import { PaymentTypeService } from '../../../../services/categories/payment-type.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TransactionDetailByObjectDialogComponent } from '../../../transaction/transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';

@Component({
  selector: 'return-to-supplier-note-screen',
  templateUrl: './return-to-supplier-note-screen.component.html',
  styleUrls: ['./return-to-supplier-note-screen.component.css'],
})
export class ReturnToSupplierNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu trả lại hàng trả cung cấp";

  listThuoc$ = new Observable<any[]>;
  listNhaCungCap$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchNhaCungCapTerm$ = new Subject<string>();
  maPhieuXuat: number = 0;
  phieuXuat: any = {};
  listPaymentType: any[] = [];
  chiTietPhieus: any[] = [
  ];
  displayedColumns = [
    '#',
    'stt',
    'anh',
    'matHang',
    'donVi',
    'soLuong',
    'donGia',
    'ck',
    'vat',
    'ton',
    'thanhTien'
  ];
  expandLabel: string = "[-]";
  showMoreForm: boolean = true;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private nhaCungCapService: NhaCungCapService,
    private thuocService: ThuocService,
    private datePipe: DatePipe,
    private paymentTypeService: PaymentTypeService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      nhaCungCapMaNhaCungCap: [0],
      maLoaiXuatNhap: [LOAI_PHIEU.PHIEU_TRA_LAI_NCC],
      ngayXuat: [],
      soPhieuXuat: [0],
      tongTien: [0],
      noteDate: [],
      dienGiai: [''],
      id: [0],
      daTra: [0],
      paymentTypeId: [1],
      backPaymentAmount: [0],
      connectivityStatusID: [0],
      discount: [0],
      isModified: [false],
      orderId: [0],
      paymentScore: [0],
      storeId: [0],
      vat: [0],
      createdByUserText : [''],
      created : [],
      recordStatusId : [0],
      nhaCungCap: [{}]
    });
  }
  @ViewChildren('pickerNgayXuat') pickerNgayXuat!: Date;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl);
      this.formData.patchValue(data);
      this.dataTable =data.chiTiets;
      this.dataTable.unshift({ isEditingItem: true });
      this.dataTable.filter(x=>x.id > 0).forEach(x=>{
        x.donViTinhs = x.thuocs.listDonViTinhs;
        x.tonHT = x.thuocs.inventory ? x.thuocs.inventory.lastValue : 0;
        x.ton = x.tonHT;
        x.heSo = x.thuocs.heSo;
        x.donViXuatLeMaDonViTinh = x.thuocs.donViXuatLeMaDonViTinh;
        x.donViThuNguyenMaDonViTinh = x.thuocs.donViThuNguyenMaDonViTinh;
        x.giaNhap = x.thuocs.giaNhap;
        if (x.heSo > 1) {
          x.tonHT = x.ton / x.heSo;
        }
        this.getItemAmount(x);
      });
      console.log(data);
      this.onSupplierChange({id: data.nhaCungCapMaNhaCungCap, tenNhaCungCap : data.nhaCungCapMaNhaCungCapText})
    }
    else {
      this.dataTable.push({ isEditingItem: true });
      let body = {
        maLoaiXuatNhap: 4,
        id: null
      }
      this.service.init(body).then((res) => {
        if (res && res.data) {
          const data = res.data;
          this.formData.controls['soPhieuXuat'].setValue(data.soPhieuXuat);
          this.formData.controls['ngayXuat'].setValue(data.ngayXuat);
        }
      });
    }
    this.getDataFilter();
  }

  ngAfterViewInit() {
    this.focusSearchDrug();
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  loadDataOpt() {
    this.paymentTypeService.searchList({}).then((res) => {
      this.listPaymentType = res?.data;
    });
  }
  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getDataFilter() {
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.getMaNhaThuoc(),
            typeService: 0
          };
          return from(this.thuocService.searchPage(bodyThuoc).then((res) => {
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
    this.listNhaCungCap$ = this.searchNhaCungCapTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyNCC = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.nhaCungCapService.searchPage(bodyNCC).then((res) => {
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
  }

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          this.dataTable[0].isEditingItem = true;
          this.dataTable[0].thuocThuocId = item.id;
          this.dataTable[0].giaXuat = item.heSo > 1 ? item.giaNhap * item.heSo : item.giaNhap;
          this.dataTable[0].soLuong = 1;
          this.dataTable[0].donViTinhMaDonViTinh = item.heSo > 1 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          this.dataTable[0].donViTinhs = item.listDonViTinhs;
          this.dataTable[0].vat = 0;
          this.dataTable[0].chietKhau = 0;
          this.dataTable[0].retailPrice = item.giaNhap;
          this.dataTable[0].tonHT = item.inventory ? item.inventory.lastValue : 0;
          this.dataTable[0].ton = this.dataTable[0].tonHT;
          this.dataTable[0].isModified = false;
          this.dataTable[0].isProdRef = false;
          this.dataTable[0].id = 0;
          this.dataTable[0].giaNhap = item.giaNhap;
          this.dataTable[0].heSo = item.heSo;
          this.dataTable[0].maThuocText = item.maThuoc;
          this.dataTable[0].tenThuocText = item.tenThuoc;
          this.dataTable[0].donViThuNguyenMaDonViTinh = item.donViThuNguyenMaDonViTinh;
          this.dataTable[0].donViXuatLeMaDonViTinh = item.donViXuatLeMaDonViTinh;
          this.dataTable[0].connectivityStatusId = 0;
          this.dataTable[0].referenceId = 0;
          this.dataTable[0].storeId = 0;
          this.dataTable[0].recordStatusId = 0;
          if (item.heSo > 1) {
            this.dataTable[0].tonHT = this.dataTable[0].ton / item.heSo;
          }
          this.getItemAmount(this.dataTable[0]);
          this.focusInputSoLuong();
        }
      });
    }
  }

  async onAddNew(item : any) {
    //kiểm tra hàng âm kho
    if (item.ton <= 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ALLOW_DELIVERY_OVER_QUANTITY);
      return;
    }
    //kiểm tra phiếu có thuốc chưa
    if (!item.thuocThuocId) {
      this.notification.error(MESSAGE.ERROR, "Hãy chọn thuốc thêm vào phiếu");
      return;
    }
    if (item.isEditingItem) {
      let isExsit = false;
      this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
        if (x.thuocThuocId == item.thuocThuocId && x.donViTinhMaDonViTinh == item.donViTinhMaDonViTinh && x.giaXuat == item.giaXuat) {
          //cong so luong
          x.soLuong = x.soLuong + item.soLuong;
          isExsit = true;
        }
      });
      if (!isExsit) {
        item.isEditingItem = false;
        item.itemOrder = this.dataTable.filter(x => !x.isEditingItem).length;
        this.dataTable.push(item);
      }
      this.dataTable[0] = { isEditingItem: true };
      this.updateTotal();
      ;
    }
    setTimeout(()=> this.focusSearchDrug(), 100);
  }

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaXuat = item.giaNhap;
      item.tonHT = item.ton;
    } else {
      item.giaXuat = item.giaNhap * item.heSo;
      item.tonHT = item.ton / item.heSo;
    }
    this.getItemAmount(item);
  }

  onSupplierChange($event: any) {
    if ($event && $event.id > 0) {
      this.formData.controls['nhaCungCap'].setValue($event);
    }
  }

  async onDelete(item: any) {
    var index = this.dataTable.indexOf(item);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
      let order = 1;
      this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
        x.itemOrder = order;
        order++;
      });
    }
    this.updateTotal();
  }

  updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
    this.formData.controls['daTra'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
  }

  async getItemAmount(item: any) {
    let discount = (item.giaXuat > 0.05 ? (item.chietKhau / item.giaXuat) : 0) * 100;
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaXuat * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
    item.retailQuantity = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.soLuong : item.soLuong * item.heSo;
    item.retailPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaXuat : item.giaXuat / item.heSo;
    this.updateTotal();
  }
  openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async onDateChange(date: Date) {
    let noteDate = this.formData.get('noteDate')?.value;
    this.formData.controls['ngayXuat'].setValue(this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '');
  }

  //save
  async onSave() {
    if (this.dataTable.filter(x => x.thuocThuocId > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    if(this.dataTable.length == 1 && this.dataTable[0].isEditingItem){
      this.onAddNew(this.dataTable[0])
    }
    body.chiTiets = this.dataTable.filter(x => x.thuocThuocId > 0);
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/note-management/return-to-supplier-note-detail', res.id]);
      }
    });
  }

  async onPaymentFull() {
    this.formData.controls['daTra'].setValue(this.formData.get('tongTien')?.value);
  }

  @ViewChildren('inputSoLuong') inputSoLuongs!: QueryList<ElementRef>;
  async focusInputSoLuong() {
    if (this.inputSoLuongs.last) {
      this.inputSoLuongs.last.nativeElement.focus();
    }
  }
  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  async focusSearchDrug() {
    this.selectDrug?.focus();
  }

  async onLockNote(){

  }

  async openTransaction() {
    if (this.formData.get('nhaCungCapMaNhaCungCap')?.value > 0) {
      var data = {
        id: this.formData.get('nhaCungCap')?.value.id,
        name: this.formData.get('nhaCungCap')?.value.tenNhaCungCap,
        typeId : LOAI_PHIEU.PHIEU_TRA_LAI_NCC
      };
      const dialogRef = this.dialog.open(TransactionDetailByObjectDialogComponent, {
        data: data,
        width: '90%',
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn nhà cung cấp');
    }

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "F9":
        this.onSave();
        break;
      case "down":
        break;
    }
  }
}
