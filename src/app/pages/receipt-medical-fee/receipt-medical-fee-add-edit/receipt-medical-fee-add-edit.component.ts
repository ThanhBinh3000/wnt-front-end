import { Component, Injector, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { Validators } from '@angular/forms';
import moment from 'moment';
import { PaymentTypeService } from '../../../services/categories/payment-type.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { MedicalFeeReceiptsService } from '../../../services/medical/medical-fee-receipts.service';
import { DatePipe } from '@angular/common';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { SETTING } from '../../../constants/setting';
import { calculateAgeInMonthsOrYears, extractYear, getAgeUnit } from '../../../utils/date.utils';
import { CustomerDetailDialogComponent } from '../../customer/customer-detail-dialog/customer-detail-dialog.component';
import { CustomerAddEditDialogComponent } from '../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { LOAI_PHIEU } from '../../../constants/config';

@Component({
  selector: 'app-receipt-medical-fee',
  templateUrl: './receipt-medical-fee-add-edit.component.html',
  styleUrls: ['./receipt-medical-fee-add-edit.component.css'],
})
export class ReceiptMedicalFeeAddEditComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU THU TIỀN";
  listPaymentType: any[] = [];
  listCustomerDebt: any[] = [];
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  customer: any = {};
  selectedCustomerId: any = null;
  selectedPaymentType: any = 0;
  showMoreForm: boolean = true;
  expandLabel: string = '[-]';
  displayedColumns: string[] = this.getDisplayedColumns();
  LOAI_PHIEU = LOAI_PHIEU;

  // Settings
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON).activated;
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC).activated;
  enablePaymentQR = this.authService.getSettingByKey(SETTING.ENABLE_PAYMENT_QR).activated;

  constructor(
    injector: Injector,
    private _service: MedicalFeeReceiptsService,
    private khachHangService: KhachHangService,
    private paymentTypeService: PaymentTypeService,
    private titleService: Title,
    private datePipe: DatePipe,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      noteDate: [this.datePipe.transform(moment().utc().startOf('day').toDate(), 'dd/MM/yyyy HH:mm:ss')],
      date: [],
      totalMoney: [],
      storeCode: [],
      discount: [],
      discountPercent: [],
      noteNumber: [],
      description: [],
      descriptNotePay: [],
      debtAmount: [],
      idCus: [0],
      typePayment: [0],
      customerName: [],
      chiTiets: [],
    })
  }

  getDisplayedColumns() {
    var val = ['stt', 'soPhieu', 'ngay', 'benhNhan', 'tenDichVu', 'nhomDichVu', 'soLan', 'gia', 'thanhTien', 'action'];
    if (this.selectedPaymentType == 0) {
      val = val.filter(e => e !== 'soPhieu' && e !== 'ngay');
    }
    return val;
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.route.queryParams.subscribe(params => {
      this.selectedCustomerId = Number(params['idCus']);
    });
    if(this.selectedCustomerId > 0){
      await this.getDetailCustomer(this.selectedCustomerId);
      this.listKhachHang$ = of([this.customer]);
      this.customer = {};
    }
    // Lấy danh sách bệnh nhân chờ thanh toán
    this.getlistCustomerDebt();
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      this.getDetailCustomer(data.idCus);
    }
    else {
      let res = await this._service.getNewNoteNumber();
      if (res?.status == STATUS_API.SUCCESS) {
        var noteNumber = res.data;
        this.formData.patchValue({ noteNumber: noteNumber });
      }
    }
  }

  getDataFilter() {
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
    this.paymentTypeService.searchList({}).then((res) => {
      this.listPaymentType = res?.data;
    });
  }

  getlistCustomerDebt() {
    let body = {
      idCus: this.selectedCustomerId > 0 ? this.selectedCustomerId : null,
      isDisplayByNote: this.selectedPaymentType == 1,
    };
    this._service.getListCustomerDebt(body).then((res: any) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listCustomerDebt = res.data;
        console.log(res);
      }
    });
  }

  onPayment(item: any) {
    this.customer = item.khachHang;
    this.customer.age = this.customer.birthDate != null ? calculateAgeInMonthsOrYears(this.customer.birthDate) : '';
    this.customer.ageUnit = this.customer.birthDate != null ? getAgeUnit(this.customer.birthDate) : '';
    this.customer.sexText = this.customer.sexId == 0 ? 'Nam' : 'Nữ';
    var tongTien = 0;
    item.chiTiets.forEach((i: any) => {
      tongTien += i.soLan * i.gia;
    });
    this.formData.patchValue({
      idCus: this.customer.id,
      debtAmount: tongTien,
      totalMoney: tongTien,
      chiTiets: item.chiTiets
    });
  }

  onDiscountChange(type: any) {
    if (this.formData.value?.discountPercent > 100 || this.formData.value?.discount > this.formData.value?.debtAmount) {
      this.notification.error(MESSAGE.ERROR, 'Chiết khấu không được lớn hơn số tiền nợ');
      return;
    }
    if (type == 'vnd') {
      this.formData.patchValue({ discountPercent: (this.formData.value?.discount / this.formData.value?.debtAmount) * 100 });
    } else {
      this.formData.patchValue({ discount: (this.formData.value?.discountPercent / 100) * this.formData.value?.debtAmount });
    }
    this.formData.patchValue({ totalMoney: this.formData.value?.debtAmount - this.formData.value?.discount });
  }

  createUpdate() {
    if (this.formData.value?.idCus <= 0) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn bệnh nhân');
      return;
    }
    if (this.formData.value?.totalMoney != this.formData.value?.debtAmount - this.formData.value?.discount) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập đủ số tiền cần trả !');
      return;
    }
    let body = this.formData.value;
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/receipt-medical-fee/list']);
      }
    });
  }

  onDetailNote(item: any) {
    if (item.typeNote == LOAI_PHIEU.PHIEU_KHAM_BENH) {
      this.goToUrl('/management/medical-note/detail', item.noteId);
    }
    else if(item.typeNote == LOAI_PHIEU.PHIEU_DICH_VU){
      this.goToUrl('/management/service-note/detail', item.noteId);
    }
  }
  async getDetailCustomer(id: any) {
    if (id) {
      let res = await this.khachHangService.getDetail(id);
      if (res?.status == STATUS_API.SUCCESS) {
        this.customer = res.data;
      }
    }
  }

  onResetSearching() {
    this.selectedCustomerId = null;
  }

  extractYear(birthDate: any) {
    return extractYear(birthDate);
  }

  onPaymentTypeChanged() {
    this.getlistCustomerDebt();
    //console.log(this.selectedPaymentType);
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

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  @ViewChildren('pickerNoteDate') pickerNoteDate!: Date;
  async onDateChange(date: Date) {
    let noteDate = this.formData.get('date')?.value;
    this.formData.patchValue({ noteDate: this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }

  async openCustomerDetailDialog(customerId: any) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: customerId,
      width: '600px',
    });
  }

  async openAddEditDialog(customer: any) {
    customer.isMinimized = false;
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      data: customer,
      width: '900px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.customer = result;
        this.customer.age = this.customer.birthDate != null ? calculateAgeInMonthsOrYears(this.customer.birthDate) : '';
        this.customer.ageUnit = this.customer.birthDate != null ? getAgeUnit(this.customer.birthDate) : '';
        this.customer.sexText = this.customer.sexId == 0 ? 'Nam' : 'Nữ';
      }
    });
  }
}