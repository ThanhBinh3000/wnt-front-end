import { Component, ElementRef, Injector, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from "../../../../component/base/base.component";
import { LOAI_PHIEU, LOAI_SAN_PHAM, RECORD_STATUS } from "../../../../constants/config";
import { NhaCungCapService } from "../../../../services/categories/nha-cung-cap.service";
import { DrugAddEditDialogComponent } from "../../../drug/drug-add-edit-dialog/drug-add-edit-dialog.component";
import { ThuocService } from "../../../../services/products/thuoc.service";
import { DonViTinhService } from "../../../../services/products/don-vi-tinh.service";
import { PaymentTypeService } from "../../../../services/categories/payment-type.service";
import { DatePipe } from '@angular/common';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import { SETTING } from '../../../../constants/setting';
import { KhachHangService } from '../../../../services/customer/khach-hang.service';
import { CustomerAddEditDialogComponent } from '../../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { SupplierAddEditDialogComponent } from '../../../supplier/supplier-add-edit-dialog/supplier-add-edit-dialog.component';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import moment from 'moment';
import { DrugUpdateBatchDialogComponent } from '../../../drug/drug-update-batch-dialog/drug-update-batch-dialog.component';
import { TransactionDetailByObjectDialogComponent } from '../../../transaction/transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';
import { MultipleWarehouseInventoryDialogComponent } from '../../../drug/multiple-warehouse-inventory-dialog/multiple-warehouse-inventory-dialog.component';
import { DrugUpdateInpriceDialogComponent } from '../../../drug/drug-update-inprice-dialog/drug-update-inprice-dialog.component';

@Component({
  selector: 'receipt-note-screen',
  templateUrl: './receipt-note-screen.component.html',
  styleUrls: ['./receipt-note-screen.component.css'],
})
export class ReceiptNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu nhập hàng";
  listThuoc$ = new Observable<any[]>;
  listNCC$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchNCCTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  nhaCungCap: any = {};

  debtValue: number = 0;
  debtLabel: string = 'Còn nợ';

  listPaymentType: any[] = [];

  // Settings
  enableCustomerToSupplier = this.authService.getSettingByKey(SETTING.ENABLE_CUSTOMER_TO_SUPPLIER).activated;
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON).activated;
  enableElectronicInvoice = this.authService.getSettingByKey(SETTING.ENABLE_ELECTRONIC_INVOICE).activated;
  displayImageProduct = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS).activated;
  enableVATOnNoteItem = this.authService.getSettingByKey(SETTING.ENABLE_VAT_ON_NOTE_ITEM).activated;
  enableDeliveryPickUp = this.authService.getSettingByKey(SETTING.ENABLE_DELIVERY_PICK_UP).activated;
  refStoreForProducts = this.authService.getSettingByKey(SETTING.REF_STORE_FOR_PRODUCTS);

  //Permit
  permittedFields = {
    drug_ViewInputPrice: this.havePermissions(['THUOC_XEMGN']),
    drug_ViewInventory: this.havePermissions(['THUOC_XEMTK']),
  }

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuNhapService,
    private nhaCungCapService: NhaCungCapService,
    private khachHangService: KhachHangService,
    private thuocService: ThuocService,
    private donViTinhService: DonViTinhService,
    private paymentTypeService: PaymentTypeService,
    private datePipe: DatePipe,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      soPhieuNhap: [],
      ngayNhap: [],
      noteDate: [],
      nhaCungCapMaNhaCungCap: '',
      invoiceNo: '',
      invoiceDate: '',
      loaiXuatNhapMaLoaiXuatNhap: LOAI_PHIEU.PHIEU_NHAP,
      tongTien: [0],
      vat: '',
      daTra: [0],
      discount: [0],
      discountWithRatio: [],
      dienGiai: '',
      paymentTypeId: [0],
      tenNguoiTao: [],
      locked: [false],
    })
  }

  getDisplayedColumns() {
    var val = ['#', 'stt', 'img', 'tenThuoc', 'donVi', 'soLuong', 'giaNhap', 'giaNhapSauVAT', 'tsln', 'ck', 'vat', 'loHan', 'ton', 'thanhTien'];
    if (this.isMobile()) {
      val = val.filter(e => e !== 'stt' && e !== 'img' && e !== 'tsln' && e !== 'ck' && e !== 'vat' && e !== 'ton');
    }
    if (!this.displayImageProduct) {
      val = val.filter(e => e !== 'img');
    }
    if (this.formData.value?.id > 0 || this.getMaNhaThuoc() != '10513') {
      val = val.filter(e => e !== 'giaNhapSauVAT');
    }
    if (!this.enableVATOnNoteItem) {
      val = val.filter(e => e !== 'vat');
    }
    if (!this.permittedFields.drug_ViewInventory) {
      val = val.filter(e => e !== 'ton');
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
        loaiXuatNhapMaLoaiXuatNhap: LOAI_PHIEU.PHIEU_NHAP,
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
    // Search nhà cung cấp
    this.listNCC$ = this.searchNCCTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.nhaCungCapService.searchPage(body).then((res) => {
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

  loadDataOpt() {
    this.paymentTypeService.searchList({}).then((res) => {
      this.listPaymentType = res?.data;
    });
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

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  trackByFn(item: any) {
    return item.id;
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
          this.dataTable[0].giaNhap = data.heSo > 1 ? data.giaNhap * data.heSo : data.giaNhap;
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
          this.dataTable[0].tonKho = data.inventory != null ? (data.heSo > 1 ? data.inventory?.lastValue / data.heSo : data.inventory?.lastValue) : 0;
          console.log(data);
          console.log(this.dataTable[0]);
          this.getItemAmount(this.dataTable[0]);
          this.focusInputSoLuong();
        }
      })
    }
  }

  onOutpriceChange(item: any, type: any) {
    if (type == 'outprice' || type == 'inprice') {
      item.rateRevenue = item.giaNhap > 0 ? parseFloat((((item.giaBanLe - item.giaNhap) / item.giaNhap) * 100).toFixed(2)) : 0;
      if (type == 'inprice') {
        this.onPriceChanged(item);
      }
    }
    else {
      item.giaBanLe = item.rateRevenue > 0 ? (item.giaNhap * ((item.rateRevenue / 100) + 1)) : 0;
    }
  }

  onPriceChanged(item: any) {
    if (this.getMaNhaThuoc() == '10513') {
      var inPrice = item.giaNhap * (item.vat / 100) + item.giaNhap;
      var outPrice = inPrice;
      item.giaNhapSauVAT = inPrice;
      if (inPrice <= 1000) {
        outPrice += inPrice * 20 / 100;
      }
      else if (inPrice > 1000 && inPrice <= 5000) {
        outPrice += inPrice * 15 / 100;
      }
      else if (inPrice > 5000 && inPrice <= 100000) {
        outPrice += inPrice * 10 / 100;
      }
      else if (inPrice > 100000 && inPrice <= 1000000) {
        outPrice += inPrice * 7 / 100;
      }
      else if (inPrice > 1000000) {
        outPrice += inPrice * 5 / 100;
      }
      item.giaBanLe = outPrice;
    }
    else if (this.getMaNhaThuoc() == '2726' || this.getMaNhaThuoc() == '2938'
      || this.getMaNhaThuoc() == '8885' || this.getMaNhaThuoc() == '12894'
      || this.getMaNhaThuoc() == '12378') {
      var inPrice = item.giaNhap * (item.vat / 100) + item.giaNhap;
      var outPrice = inPrice;
      item.giaNhapSauVAT = inPrice;
      if (inPrice <= 1000) {
        outPrice += inPrice * 15 / 100;
      }
      else if (inPrice > 1000 && inPrice <= 5000) {
        outPrice += inPrice * 10 / 100;
      }
      else if (inPrice > 5000 && inPrice <= 100000) {
        outPrice += inPrice * 7 / 100;
      }
      else if (inPrice > 100000 && inPrice <= 1000000) {
        outPrice += inPrice * 5 / 100;
      }
      else if (inPrice > 1000000) {
        outPrice += inPrice * 2 / 100;
      }
      item.giaBanLe = outPrice;
    }
    else if (this.getMaNhaThuoc() == '10269') {
      var inPrice = item.giaNhap * (item.vat / 100) + item.giaNhap;
      var outPrice = inPrice;
      item.giaNhapSauVAT = inPrice;
      if (inPrice >= 1000 && inPrice <= 100000) {
        outPrice += inPrice * 10 / 100;
      }
      else if (inPrice > 100000 && inPrice <= 1000000) {
        outPrice += inPrice * 7 / 100;
      }
      else if (inPrice > 1000000) {
        outPrice += inPrice * 5 / 100;
      }
      item.giaBanLe = outPrice;
    }
    else return;
  };

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
    let discount = (item.giaNhap > 0.05 ? (item.chietKhau / item.giaNhap) : 0) * 100;
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaNhap * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
    item.retailQuantity = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.soLuong : item.soLuong * item.heSo;
    item.retailPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaNhap : item.giaNhap / item.heSo;
    item.retailOutPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaBanLe : item.giaBanLe / item.heSo;
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
            { queryParams: { noteTypeId: LOAI_PHIEU.PHIEU_NHAP } });
        } else {
          this.router.navigate(['/management/note-management/receipt-note-detail', data.id],
            { queryParams: { isContinue: true } });
        }
      }
    });
  }

  getBatchExpiryCss(item: any) {
    if ((item.expiredDate != null && item.expiredDate != '') || (item.batchNumber != null && item.batchNumber != '')) return 'btn-success';

    return 'btn-primary';
  }

  async onLockNote() {
    let locked = this.formData.get('locked')?.value;
    const res = locked ? await this._service.unlock({ id: this.formData.get('id')?.value }) : await this._service.lock({ id: this.formData.get('id')?.value });
    if (res && res.status == STATUS_API.SUCCESS) {
      this.formData.controls['locked'].setValue(res.data.locked);
      this.notification.success(MESSAGE.SUCCESS, this.formData.get('locked')?.value ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  getBatchNumberAndExpDate(item: any) {
    if (!item) return '';

    var retVal = '';
    if (item.hanDung != null && item.hanDung.length > 0) {
      retVal = moment(item.hanDung).format('DD/MM/YYYY');
    }
    if (item.soLo != null && item.soLo.length > 0) {
      if (retVal.length == 0) {
        retVal = item.soLo;
      } else {
        retVal = retVal.concat("\n(", item.soLo, ")");
      }
    }

    return retVal;
  };

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

  onChangeDiscount($event: any, type: any) {
    let tongTien = this.formData.value.tongTien;
    console.log($event, tongTien)
    if (+$event > 0 && tongTien > 0) {
      let input = +$event;
      if (type == 1) {
        let percent = (input / tongTien) * 100;
        this.formData.patchValue({
          discountWithRatio: percent,
          daTra: (tongTien - input)
        })
      } else {
        let discount = tongTien * (input / 100);
        this.formData.patchValue({
          discount: discount,
          daTra: tongTien - discount
        });
      }
    }
  }

  async onChangeSupplier($event: any) {
    if ($event) {
      let res = this.enableCustomerToSupplier ? await this.khachHangService.getDetail($event.id) : await this.nhaCungCapService.getDetail($event.id);
      if (res?.status == STATUS_API.SUCCESS) {
        this.nhaCungCap = res.data;
        this.nhaCungCap.maSoThue = this.enableCustomerToSupplier ? res.data.taxCode : res.data.maSoThue;
        this._service.getDebtSupplier(this.formData.value).then((i) => {
          if (i) {
            this.nhaCungCap.debtAmount = i.data;
          }
        });
        console.log(this.nhaCungCap);
      }
    }
  }

  isShow = true;
  showOption() {
    this.isShow = !this.isShow;
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

  // getSaveTitle() {
  //   var lable = $scope.viewModel.IsConnectivity ? 'LT' : 'Ghi Phiếu'
  //   return $scope.viewModel.IsManagement ? 'QL' : lable;
  // };

  @ViewChildren('pickerInvoiceDate') pickerInvoiceDate!: Date;
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

  async openSupplierAddEditDialog() {
    const dialogRef = this.dialog.open(SupplierAddEditDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.listNCC$ = of([result]);
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

  openUpdateBatchDialog(drug: any) {
    if (drug.thuocThuocId > 0) {
      const dialogRef = this.dialog.open(DrugUpdateBatchDialogComponent, {
        data: drug,
        width: '600px',
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          drug.soLo = result.batchNumber;
          drug.hanDung = result.expiredDate;
        }
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, 'Hãy chọn thuốc muốn cập nhật số lô/hạn dùng.');
    }
  }

  async openTransaction() {
    if (this.formData.value?.nhaCungCapMaNhaCungCap > 0) {
      var data = {
        id: this.nhaCungCap?.id,
        name: this.enableCustomerToSupplier ? this.nhaCungCap?.tenKhachHang : this.nhaCungCap?.tenNhaCungCap,
        typeId: LOAI_PHIEU.PHIEU_NHAP
      };
      const dialogRef = this.dialog.open(TransactionDetailByObjectDialogComponent, {
        data: data,
        width: '90%',
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn nhà cung cấp');
    }

  }

  async updateInPrice($event: any, data: any) {
    if (data == null || data.thuocThuocId == null || data.thuocThuocId <= 0) {
      this.notification.error(MESSAGE.ERROR, 'Hãy chọn thuốc muốn cập nhật giá.');
      return;
    }
    if (data.isProdRef && this.refStoreForProducts.activated && this.refStoreForProducts.value != '' && this.refStoreForProducts.value != null
      && (this.refStoreForProducts.value == '0012' || this.refStoreForProducts.value == 'DQG' || this.refStoreForProducts.value == 'DQGB')) {

    }
    else {
      const dialogRef = this.dialog.open(DrugUpdateInpriceDialogComponent, {
        data: data,
        width: '600px',
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          console.log(result);
          data.giaBanLe = result.giaBanLe;
        }
      });
    }
  }

  async onGetDataDetailLastValueWarehouse(data: any) {
    this.dialog.open(MultipleWarehouseInventoryDialogComponent, {
      data: { thuocId: data.thuocThuocId, tenThuoc: data.tenThuoc },
      width: '600px',
    });
  }

  checkNhaThuoc(): boolean {
    const allowedNhaThuoc = ['0010', '3214', '3220', '3780', '13202'];
    return allowedNhaThuoc.includes(this.authService.getNhaThuoc().maNhaThuoc);
  }

  protected readonly LOAI_PHIEU = LOAI_PHIEU;
}
