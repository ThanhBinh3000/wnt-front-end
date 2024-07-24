import { Component, Injector, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKhamService } from '../../../services/medical/phieu-kham.service';
import { SETTING } from '../../../constants/setting';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { LOAI_SAN_PHAM, TRANG_THAI_PHIEU_KHAM } from '../../../constants/config';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { CustomerAddEditDialogComponent } from '../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { ThuocService } from '../../../services/products/thuoc.service';
import { PhongKhamsService } from '../../../services/medical/phong-khams.service';
import { DoctorAddEditDialogComponent } from '../../doctor/doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';
import { SampleNoteHistoryDialogComponent } from '../../sample-note/sample-note-history-dialog/sample-note-history-dialog.component';
import { calculateAge, calculateAgeInMonthsOrYears, calculateDayFromDateRange, convertDateFormat, convertDateObject, getAgeUnit } from '../../../utils/date.utils';
import { PaymentMediCalNoteDialogComponent } from '../payment-medical-note-dialog/payment-medical-note-dialog.component';

@Component({
  selector: 'app-medical-note',
  templateUrl: './medical-note-add-edit.component.html',
  styleUrls: ['./medical-note-add-edit.component.css'],
})
export class MedicalNoteAddEditComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU KHÁM BỆNH";
  TRANG_THAI_PHIEU_KHAM = TRANG_THAI_PHIEU_KHAM;
  isReexaminationDateNumChanged = false;
  isReexaminationDateChanged = false;
  listBacSies: any[] = [];
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  listLoaiKham: any[] = [];
  listPhongKham: any[] = [];
  listDiagnose$ = new Observable<any[]>;
  searchDiagnoseTerm$ = new Subject<string>();

  action: string = 'create';

  // Settings
  useDoctorCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC);

  constructor(
    injector: Injector,
    private titleService: Title,
    private datePipe: DatePipe,
    private _service: PhieuKhamService,
    private bacSiesService: BacSiesService,
    private khachHangService: KhachHangService,
    private thuocService: ThuocService,
    private phongKhamService: PhongKhamsService,
    private diagnoseService: EsDiagnoseService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      noteNumber: [],
      noteDate: [this.datePipe.transform(moment().utc().startOf('day').toDate(), 'dd/MM/yyyy HH:mm:ss')],
      ngayTao: [],
      statusNote: [TRANG_THAI_PHIEU_KHAM.DANG_KHAM],
      idPatient: [],
      customer: this.fb.group({
        id: [],
        tenKhachHang: [],
        diaChi: [''],
        birthDate: [],
        age: [],
        ageUnit: [],
        sexId: [''],
        soDienThoai: ['']
      }),
      sickCondition: [0], //tình trạng
      totalMoney: [0], //tiền khám
      idServiceExam: [0], //loại khám
      idDoctor: [0],
      clinicCode: [0],
      reasonExamination: [''], //lý do khám
      clinicalExamination: [''], //khám lâm sàng
      includingDiseases: [''], //bệnh kèm theo
      chanDoanIds: [],
      diagnosticIds: [''],
      diagnosticOther: [''], //chẩn đoán khác
      conclude: [''], //KL & HĐT
      heartbeat: [], //nhịp tim
      weight: [], //cân nặng
      breathing: [], //nhịp thở
      temperature: [], //nhiệt độ
      bloodPressure: [], //huyết áp
      height: [], //chiều cao
      drugAllergy: [''], //dị ứng thuốc
      isLock: [false], //khoá phiếu
      isDeb: [false], //nợ
      reexaminationChecked: [false],
      reexaminationDateNum: [],
      reexaminationDate: [], //ngày tái khám
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    this.titleService.setTitle(this.title);
  }

  async ngAfterViewInit() {
    this.route.data.subscribe((data: any) => {
      this.action = data.action;
    });
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      console.log(data);
      data.idServiceExam = data.idServiceExam < 0 ? 0 : data.idServiceExam;
      data.clinicCode = data.clinicCode < 0 ? 0 : data.clinicCode;
      if (data.idPatient > 0) {
        this.listKhachHang$ = of([data.customer]);
      }
      this.formData.patchValue(data);
    }
    else {
      this.service.init({}).then((res) => {
        if (res && res.data) {
          const data = res.data;
          console.log(data);
          this.formData.patchValue({
            noteDate: data.noteDate,
            noteNumber: data.noteNumber,
          })
        }
      });
    }
  }

  getDataFilter() {
    // Bác sĩ
    this.getListBacSies();
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
            maNhaThuoc: this.useCustomerCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
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
    // Loại khám
    this.thuocService.searchPage({
      maNhaThuoc: this.getMaNhaThuocCha() != '' && this.getMaNhaThuocCha() != null ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      typeService: LOAI_SAN_PHAM.DICH_VU,
      nhomThuocTenNhomThuoc: "Khám bệnh",
      paggingReq: { limit: 1000, page: 0 },
      dataDelete: false,
    }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listLoaiKham = res.data.content;
        this.listLoaiKham.unshift({ id: 0, tenThuoc: '-Mặc định-' });
      }
    });
    // Phòng khám
    this.phongKhamService.searchList({
      maNhaThuoc: this.getMaNhaThuoc(),
    }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPhongKham = res.data
      }
    });
    // Search Diagnose
    this.listDiagnose$ = this.searchDiagnoseTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
          };
          return from(this.diagnoseService.searchPage(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              console.log(res.data.content);
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

  getListBacSies() {
    let body = {
      maNhaThuoc: this.useDoctorCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      paggingReq: { limit: 1000, page: 0 },
    };
    this.bacSiesService.searchPage(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listBacSies = res.data.content;
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

  getPatientDetail($event: any) {
    if ($event) {
      if ($event.birthDate) {
        $event.age = calculateAgeInMonthsOrYears($event.birthDate);
        $event.ageUnit = getAgeUnit($event.birthDate);
        $event.birthDate = convertDateFormat($event.birthDate);
      }
      this.formData.patchValue({ customer: $event });
      //console.log(this.formData.value?.customer);
    }
  }

  onHistorySampleNote(customerId: any) {
    if (customerId > 0) {
      this.dialog.open(SampleNoteHistoryDialogComponent, {
        width: '50%',
        data: this.formData.value?.customer
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn bệnh nhân.');
    }
  }

  async onLockNote() {
    let locked = this.formData.get('isLock')?.value;
    const res = await this._service.lock({ id: this.formData.get('id')?.value, isLock: !locked });
    if (res && res.status == STATUS_API.SUCCESS) {
      this.formData.controls['isLock'].setValue(res.data.isLock);
      this.notification.success(MESSAGE.SUCCESS, this.formData.get('isLock')?.value ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  async changeStatus(status: any) {
    if (this.formData.value?.id <= 0) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa tạo phiếu khám.');
      return;
    }
    if (this.formData.value?.idDoctor <= 0) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn bác sỹ.');
      return;
    }
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: status == TRANG_THAI_PHIEU_KHAM.DA_KHAM ? 'Bạn chắc chắn muốn kết thúc quá trình khám ?' : 'Bạn chắc chắn muốn hủy kết thúc quá trình khám ?',
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        try {
          this._service.changeStatus({ id: this.formData.value?.id, statusNote: status }).then(async (res) => {
            if (res && res.data) {
              this.formData.patchValue({ statusNote: res.data.statusNote });
              this.notification.success(MESSAGE.SUCCESS, res.data.statusNote == TRANG_THAI_PHIEU_KHAM.DA_KHAM ? 'Kết thúc quá trình khám thành công' : 'Hủy kết thúc quá trình khám thành công');
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  idServiceExamChange($event: any) {
    if ($event.id <= 0) {
      this.formData.patchValue({ totalMoney: 0 });
      return;
    }
    this.formData.patchValue({ totalMoney: $event.giaBanLe });
  }

  createUpdate() {
    let body = this.formData.value;
    if (body.reexaminationDateNum > 0) {
      body.reexaminationDate = this.datePipe.transform(body.reexaminationDate, 'dd/MM/yyyy HH:mm:ss');
    }
    body.diagnosticIds = body.chanDoanIds != null ? body.chanDoanIds.join(',') : '';
    this.save(body).then(res => {
      if (res) {
        this.goToUrl('/management/medical-note/detail', res.id);
      }
    });
  }

  openFormEdit(){
    if(this.formData.value?.id > 0) this.goToUrl('/management/medical-note/edit', this.formData.value?.id);
  }

  async openCustomerAddEditDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.listKhachHang$ = of([result]);
        this.formData.patchValue({ idPatientId: result.id, customer: result });
      }
    });
  }

  async openDoctorAddEditDialog() {
    const dialogRef = this.dialog.open(DoctorAddEditDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.getListBacSies();
        this.formData.patchValue({ idDoctor: result.id });
      }
    });
  }

  async openPaymentMedicalNoteDialog() {
    var data = this.formData.value;
    data.action = this.action;
    this.dialog.open(PaymentMediCalNoteDialogComponent, {
      data: data,
      width: '600px',
    });
  }

  birthDateChange() {
    if (this.formData.value?.customer.birthDate) {
      this.formData.get('customer')?.patchValue({ age: calculateAgeInMonthsOrYears(this.formData.value?.customer.birthDate) });
    }
  }

  reexaminationDateNumChanged() {
    if (this.formData.value?.reexaminationChecked && !this.isReexaminationDateChanged) {
      this.isReexaminationDateNumChanged = true;
      var dateNum = this.formData.value?.reexaminationDateNum;
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + parseInt(dateNum));
      console.log(currentDate);
      this.formData.patchValue({ reexaminationDate: currentDate });
      this.isReexaminationDateNumChanged = false;
    }
  }

  reexaminationDateChanged() {
    if (this.formData.value?.reexaminationChecked && !this.isReexaminationDateNumChanged) {
      this.isReexaminationDateChanged = true;
      var fromDate = this.formData.value?.noteDate;
      var toDate = this.datePipe.transform(this.formData.value?.reexaminationDate, 'dd/MM/yyyy HH:mm:ss');
      let dateNum = calculateDayFromDateRange(fromDate, toDate);
      if (dateNum < 0) {
        this.notification.error(MESSAGE.ERROR, 'Ngày tái khám phải lớn hơn ngày tạo!');
        return;
      }
      this.formData.patchValue({ reexaminationDateNum: dateNum });
      this.isReexaminationDateChanged = false;
    }
  }

  @ViewChildren('pickerReexaminationDate') pickerReexaminationDate!: Date;
  @ViewChildren('pickerBirthDate') pickerBirthDate!: Date;
  @ViewChildren('pickerNoteDate') pickerNoteDate!: Date;
  async onDateChange(date: Date) {
    let ngayTao = this.formData.get('ngayTao')?.value;
    this.formData.patchValue({ noteDate: this.datePipe.transform(ngayTao, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }
}