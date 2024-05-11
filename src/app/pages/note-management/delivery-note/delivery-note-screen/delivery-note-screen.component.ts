import { AfterViewInit, Component, ElementRef, HostListener, Injector, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { SETTING } from '../../../../constants/setting';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { KhachHangService } from '../../../../services/customer/khach-hang.service';
import { ThuocService } from '../../../../services/products/thuoc.service';
import { BacSiesService } from '../../../../services/medical/bac-sies.service';
import { DatePipe } from '@angular/common';
import { PaymentTypeService } from '../../../../services/categories/payment-type.service';
import { LOAI_PHIEU, LOAI_SAN_PHAM } from '../../../../constants/config';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { NhanVienNhaThuocsService } from '../../../../services/system/nhan-vien-nha-thuocs.service';
import { UserProfileService } from '../../../../services/system/user-profile.service';
import { DrugUpdateBatchDialogComponent } from '../../../drug/drug-update-batch-dialog/drug-update-batch-dialog.component';
import moment from 'moment';
import { RegionInformationEditDialogComponent } from '../../../utilities/region-information-edit-dialog/region-information-edit-dialog.component';
import { CustomerAddEditDialogComponent } from '../../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { DoctorAddEditDialogComponent } from '../../../doctor/doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, forkJoin, from, observeOn, of, startWith, switchMap } from 'rxjs';
import { DrugAddEditDialogComponent } from '../../../drug/drug-add-edit-dialog/drug-add-edit-dialog.component';
import { TransactionDetailByObjectDialogComponent } from '../../../transaction/transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';

@Component({
  selector: 'delivery-note-screen',
  templateUrl: './delivery-note-screen.component.html',
  styleUrls: ['./delivery-note-screen.component.css'],
})
export class DeliveryNoteScreenComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Phiếu bán hàng";

  listBacSys : any[] = [];
  listThuoc$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  listPaymentType: any[] = [];
  listNhanViens: any[] = [];

  expandLabel: string = "[-]";
  showMoreForm: boolean = true;
  totalScore: number = 0;
  totalDebtAmount: number = 0;
  debtValue: number = 0;
  debtLabel: string = 'Còn nợ';
  isAdminUser: boolean = true;
  loaiGiaBan: number = 0;
  drugDefault: any = {};
  copyId = 0;


  notAllowDeliverOverQuantity = this.authService.getSettingByKey(SETTING.NOT_ALLOW_DELIVER_OVER_QUANTITY);
  allowChangeTotalAmountInDeliveryNote = this.authService.getSettingByKey(SETTING.ALLOW_CHANGE_TOTAL_AMOUNT_IN_DELIVERY_NOTE);
  updateImagesForProducts = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS);
  moneyPerScoreRate = this.authService.getSettingByKey(SETTING.MONEY_PER_SCORE_RATE);
  enableChangeStaffDeliveryNote = this.authService.getSettingByKey(SETTING.ENABLE_CHANGE_STAFF_DELIVERY_NOTE);
  enableElectronicInvoice = this.authService.getSettingByKey(SETTING.ENABLE_ELECTRONIC_INVOICE);
  deliveryNoteDiscountTotalByValue = this.authService.getSettingByKey(SETTING.DELIVERY_NOTE_DISCOUNT_TOTAL_BY_VALUE);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private khachHangService: KhachHangService,
    private thuocService: ThuocService,
    private bacSiesService: BacSiesService,
    private datePipe: DatePipe,
    private paymentTypeService: PaymentTypeService,
    private userProfileService: UserProfileService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      khachHangMaKhachHang: [0],
      maLoaiXuatNhap: [LOAI_PHIEU.PHIEU_XUAT],
      ngayXuat: [],
      soPhieuXuat: [0],
      tongTien: [0],
      noteDate: [],
      dienGiai: [''],
      id: [0],
      daTra: [0],
      paymentTypeId: [0],
      backPaymentAmount: [0],
      connectivityStatusID: [0],
      discount: [0],
      isModified: [false],
      orderId: [0],
      paymentScore: [0],
      paymentScoreAmount: [0],
      storeId: [0],
      vat: [0],
      createdByUserText: [''],
      created: [],
      recordStatusId: [0],
      bacSyMaBacSy: [0],
      doseNumber: [1],
      createdByUserId: [0],
      invoiceNo: [],
      invoiceDate: [''],
      nationalFacilityCode: [''],
      discountWithRatio: [0],
      doctorComments: [''],
      locked: [],
      khachHang: [{}],
      uId:[],
      modified: [],
      modifiedByUserId: [0]
    });
  }

  @ViewChildren('pickerNgayXuat') pickerNgayXuat!: Date;
  @ViewChildren('pickerInvoiceDate') pickerInvoiceDate!: Date;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    this.route.queryParams.subscribe(params => {
      this.copyId = Number(params['copyId']);
    });
    this.getId();
    if (this.isUpdateView() || this.copyId > 0) {
      let noteId = !this.idUrl ? this.copyId : this.idUrl;
      let data = await this.detail(noteId);
      this.getDataUpdate(data , data.chiTiets);
    }
    
    if(!this.isUpdateView()){
      console.log(this.isUpdateView());
      let body = {
        maLoaiXuatNhap: LOAI_PHIEU.PHIEU_XUAT,
        id: this.copyId > 0 ? this.copyId : null
      }
      this.service.init(body).then((res) => {
        if (res && res.data) {
            this.formData.controls['id'].setValue(0);
             this.formData.controls['createdByUserId'].setValue(0);
             this.formData.controls['modifiedByUserId'].setValue(0);
             this.formData.controls['created'].setValue(null);
             this.formData.controls['modified'].setValue(null);
             this.formData.controls['soPhieuXuat'].setValue(res.data.soPhieuXuat);
             this.formData.controls['ngayXuat'].setValue(res.data.ngayXuat);
             this.formData.controls['khachHangMaKhachHang'].setValue(res.data.khachHangMaKhachHang);
             this.formData.controls['khachHang'].setValue({ id: res.data.khachHangMaKhachHang, tenKhachHang: "Khách hàng lẻ" });
        }
      });
    }
    this.dataTable.unshift({ isEditingItem: true });
    this.getDataFilter();
    console.log(this.formData.value);
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

  isUpdateView() {
    return this.idUrl;
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getDataFilter() {
    let body = { dataDelete: false, maNhaThuoc: this.getMaNhaThuoc() };
    this.bacSiesService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listBacSys = res.data;
      }
    });

    this.userProfileService.searchListStaffManagement(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhanViens = res.data;
      }
    });

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
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyKhachHang = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.khachHangService.searchPage(bodyKhachHang).then((res) => {
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

  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

  // Call to clear
  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          this.dataTable[0].isEditingItem = true;
          this.dataTable[0].thuocThuocId = item.id;
          this.dataTable[0].giaXuat = item.heSo > 1 ? item.giaBanLe * item.heSo : item.giaBanLe;
          this.dataTable[0].soLuong = 1;
          this.dataTable[0].donViTinhMaDonViTinh = item.heSo > 1 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          this.dataTable[0].donViTinhs = item.listDonViTinhs;
          this.dataTable[0].vat = 0;
          this.dataTable[0].chietKhau = 0;
          this.dataTable[0].retailPrice = item.giaBanLe;
          this.dataTable[0].tonHT = item.inventory ? item.inventory.lastValue : 0;
          this.dataTable[0].ton = this.dataTable[0].tonHT;
          this.dataTable[0].isModified = false;
          this.dataTable[0].isProdRef = false;
          this.dataTable[0].id = 0;
          this.dataTable[0].heSo = item.heSo;
          this.dataTable[0].maThuocText = item.maThuoc;
          this.dataTable[0].tenThuocText = item.tenThuoc;
          this.dataTable[0].maThuoc = item.maThuoc;
          this.dataTable[0].tenThuoc = item.tenThuoc;
          this.dataTable[0].donViThuNguyenMaDonViTinh = item.donViThuNguyenMaDonViTinh;
          this.dataTable[0].donViXuatLeMaDonViTinh = item.donViXuatLeMaDonViTinh;
          this.dataTable[0].connectivityStatusId = 0;
          this.dataTable[0].referenceId = 0;
          this.dataTable[0].storeId = 0;
          this.dataTable[0].recordStatusId = 0;
          this.dataTable[0].giaBanBuon = item.giaBanBuon;
          this.dataTable[0].giaBanLe = item.giaBanLe;
          if (this.loaiGiaBan == 1) {
            this.dataTable[0].giaXuat = item.giaBanBuon;
            this.dataTable[0].retailPrice = item.heSo > 1 ? item.giaBanBuon / item.heSo : item.giaBanBuon;
          }
          if (item.heSo > 1) {
            this.dataTable[0].tonHT = this.dataTable[0].ton / item.heSo;
          }
          this.getItemAmount(this.dataTable[0]);
          this.focusInputSoLuong();
        }
      });
    }
  }

  async changeLoaiGiaBan() {
    if (this.dataTable[0].id == 0) {
      if (this.loaiGiaBan == 1) {
        this.dataTable[0].giaXuat = this.dataTable[0].heSo > 1 ? this.dataTable[0].giaBanBuon / this.dataTable[0].heSo : this.dataTable[0].giaBanBuon;
      } else {
        this.dataTable[0].giaXuat = this.dataTable[0].heSo > 1 ? this.dataTable[0].giaBanLe / this.dataTable[0].heSo : this.dataTable[0].giaBanLe;
      }
    }
  }

  async onAddNew(item: any) {
    //kiểm tra hàng âm kho
    if (item.ton <= 0 && this.notAllowDeliverOverQuantity.activated) {
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
    setTimeout(() => this.focusSearchDrug(), 100);
  }

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaXuat = item.giaBanLe;
      item.tonHT = item.ton;
    } else {
      item.giaXuat = item.giaBanLe * item.heSo;
      item.tonHT = item.ton / item.heSo;
    }
    await this.getItemAmount(item);
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
    let paymentScoreAmount = this.formData.get('paymentScoreAmount')?.value;
    let discount = this.formData.get('discount')?.value;
    let totalAmount = this.formData.get('tongTien')?.value;
    this.formData.controls['daTra'].setValue(totalAmount - discount - paymentScoreAmount);
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
    if (this.dataTable.length == 1 && this.dataTable[0].isEditingItem) {
      await this.onAddNew(this.dataTable[0])
    }
    body.chiTiets = this.dataTable.filter(x => x.thuocThuocId > 0);
    this.save(body).then(data => {
      if (data) {
        if (this.isUpdateView()) {
          this.router.navigate(['/management/note-management/list'],
            { queryParams: { noteTypeId: LOAI_PHIEU.PHIEU_XUAT } });
        } else {
          this.router.navigate(['/management/note-management/delivery-note-detail', data.id],
            { queryParams: { isContinue: true } });
        }
      }
    });
  }

  async onPaymentFull() {
    let paymentScoreAmount = 0;
    let paymentScore = this.formData.get('paymentScore')?.value;
    let totalAmount = this.formData.get('tongTien')?.value;
    let discount = this.formData.get('discount')?.value;
    if (paymentScore > 0.5 && this.moneyPerScoreRate.value > 0.5) {
      paymentScoreAmount = Math.round(paymentScore * this.moneyPerScoreRate.value);
    }
    this.formData.controls['paymentScoreAmount'].setValue(paymentScoreAmount);

    var paymentAmount = Math.round(totalAmount - discount - paymentScoreAmount);
    if (paymentAmount < 0.5) {
      paymentAmount = 0;
    }
    this.formData.controls['daTra'].setValue(paymentAmount);

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


  //điểm khach hang
  async onPaymentScoreChange() {
    let paymentScore = this.formData.get('paymentScore')?.value;
    if (paymentScore > this.totalScore) {
      this.formData.controls['paymentScore'].setValue(0);
    }
    await this.onPaymentFull();
  }

  getDebtAmount() {
    let totalAmount = Number(this.formData.get('tongTien')?.value);
    let paymentAmount = Number(this.formData.get('daTra')?.value);
    let discount = Number(this.formData.get('discount')?.value);
    let paymentScoreAmount = Number(this.formData.get('paymentScoreAmount')?.value);
    this.debtValue = Number(totalAmount - (paymentAmount + discount + paymentScoreAmount));
    this.debtLabel = this.debtValue < 0 ? 'Tiền thừa' : 'Còn nợ';
    return this.debtValue < 0 ? -this.debtValue : this.debtValue;
  }

  getDisplayedColumns() {
    let displayedColumns = [
      '#',
      'stt',
      'anh',
      'matHang',
      'donVi',
      'soLuong',
      'donGia',
      'ck',
      'vat',
      'loHan',
      'ton',
      'thanhTien'
    ];
    if (!this.updateImagesForProducts.activated) {
      displayedColumns = displayedColumns.filter(x => x !== 'anh');
    }
    return displayedColumns;
  }

  async onLockNote() {
    let locked = this.formData.get('locked')?.value;
    const res = locked ? await this._service.unlock({ id: this.formData.get('id')?.value }) : await this._service.lock({ id: this.formData.get('id')?.value });
    if (res && res.status == STATUS_API.SUCCESS) {
      this.formData.controls['locked'].setValue(res.data.locked);
      this.notification.success(MESSAGE.SUCCESS, this.formData.get('locked')?.value ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  //lấy thông tin điểm, nợ khách hàng
  onCustomerChange($event: any) {
    if ($event && $event.id > 0) {
      this.formData.controls['khachHang'].setValue($event);
      //điểm tích luỹ
      let bodyKH = {
        id: $event.id,
        maNhaThuoc: this.getMaNhaThuoc()
      }
      this.khachHangService.getPaymentScore(bodyKH).then(res => {
        if (res && res.status == STATUS_API.SUCCESS) {
          this.totalScore = res.data;
        }
      });
      //nợ khách hàng
      let bodyPX = {
        khachHangMaKhachHang: $event.id,
        nhaThuocMaNhaThuoc: this.getMaNhaThuoc(),
        ngayTinhNo: this.formData.get('ngayXuat')?.value
      }
      this._service.getTotalDebtAmountCustomer(bodyPX).then(res => {
        if (res && res.status == STATUS_API.SUCCESS) {
          this.totalDebtAmount = res.data;
        }
      });
    }
  }

  openUpdateBatchDialog(drug: any) {
    if (drug.thuocThuocId > 0) {
      drug.isShowUsage = true;
      const dialogRef = this.dialog.open(DrugUpdateBatchDialogComponent, {
        data: drug,
        width: '600px',
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, 'Hãy chọn thuốc muốn cập nhật số lô/hạn dùng.');
    }
  }

  getBatchNumberAndExpDate(item: any) {
    if (!item) return '';

    var retVal = '';
    if (item.expiredDate != null && item.expiredDate.length > 0) {
      retVal = moment(item.expiredDate).format('DD/MM/YYYY');
    }
    if (item.batchNumber != null && item.batchNumber.length > 0) {
      if (retVal.length == 0) {
        retVal = item.batchNumber;
      } else {
        retVal = retVal.concat("\n(", item.batchNumber, ")");
      }
    }

    return retVal;
  };

  getBatchExpiryCss(item: any) {
    if ((item.expiredDate != null && item.expiredDate != '') || (item.batchNumber != null && item.batchNumber != '')) return 'btn-success';

    return 'btn-primary';
  }

  //ck quy ra tien or %
  onDiscountChange(type: any) {
    let totalAmount = this.formData.get('tongTien')?.value;
    let discount = this.formData.get('discount')?.value;
    let discountWithRatio = this.formData.get('discountWithRatio')?.value;
    let paymentScoreAmount = this.formData.get('paymentScoreAmount')?.value;
    if (type = 'tien') {
      this.formData.controls['discountWithRatio'].setValue(totalAmount > 0.5 ? (discount / totalAmount) * 100 : 0);
    } else {
      this.formData.controls['discount'].setValue((discountWithRatio / 100) * totalAmount);
    }
    discount = this.formData.get('discount')?.value;
    this.formData.controls['daTra'].setValue(totalAmount - discount - paymentScoreAmount);
    this.getDebtAmount();
  }

  onReturnListing() {
    this.router.navigate(['/management/note-management/list']);
  }

  async openAddCustomerDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      data: { isMinimized: true },
      width: '70%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.formData.controls['khachHang'].setValue(result);
        this.formData.controls['khachHangMaKhachHang'].setValue(result.id);
      }
    });
  }

  async openAddDoctorDialog() {
    const dialogRef = this.dialog.open(DoctorAddEditDialogComponent, {
      data: 0,
      width: '30%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.formData.controls['bacSyMaBacSy'].setValue(result.id);
        this.bacSiesService.searchList({ dataDelete: false, maNhaThuoc: this.getMaNhaThuoc() }).then((res) => {
          if (res?.status == STATUS_API.SUCCESS) {
            this.listBacSys = res.data;
          }
        });
      }
    });
  }

  async openAddDrugDialog() {
    const dialogRef = this.dialog.open(DrugAddEditDialogComponent, {
      data: 0,
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.drugDefault = result;
        this.onDrugChange({ id: result.id });
      }
    });
  }

  async openTransaction() {
    if (this.formData.get('khachHangMaKhachHang')?.value > 0) {
      var data = {
        id: this.formData.get('khachHang')?.value.id,
        name: this.formData.get('khachHang')?.value.tenKhachHang,
        typeId : LOAI_PHIEU.PHIEU_XUAT
      };
      const dialogRef = this.dialog.open(TransactionDetailByObjectDialogComponent, {
        data: data,
        width: '90%',
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn khách hàng');
    }

  }

  async getDataUpdate(data: any, chiTiets : any[]) {
    this.formData.patchValue(data);
    this.dataTable = chiTiets;
    this.dataTable.filter(x => x.id > 0).forEach(x => {
      x.donViTinhs = x.thuocs.listDonViTinhs;
      x.tonHT = x.thuocs.inventory ? x.thuocs.inventory.lastValue : 0;
      x.ton = x.tonHT;
      x.heSo = x.thuocs.heSo;
      x.donViXuatLeMaDonViTinh = x.thuocs.donViXuatLeMaDonViTinh;
      x.donViThuNguyenMaDonViTinh = x.thuocs.donViThuNguyenMaDonViTinh;
      x.maThuoc = x.maThuocText;
      x.tenThuoc = x.tenThuocText;
      x.giaBanLe = x.thuocs.giaBanLe;
      x.giaBanBuon = x.thuocs.giaBanBuon;
      if (x.donViTinhMaDonViTinh == x.donViThuNguyenMaDonViTinh) {
        x.tonHT = x.ton / x.heSo;
      }
      this.getItemAmount(x);
    });
    this.onCustomerChange({ id: data.khachHangMaKhachHang, tenKhachHang: data.khachHangMaKhachHangText });
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
