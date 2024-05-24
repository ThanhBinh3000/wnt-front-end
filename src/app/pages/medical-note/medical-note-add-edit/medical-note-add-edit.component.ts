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
import { STATUS_API } from '../../../constants/message';
import { CustomerAddEditDialogComponent } from '../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { ThuocService } from '../../../services/products/thuoc.service';
import { PhongKhamsService } from '../../../services/medical/phong-khams.service';
import { DoctorAddEditDialogComponent } from '../../doctor/doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';

@Component({
  selector: 'app-medical-note',
  templateUrl: './medical-note-add-edit.component.html',
  styleUrls: ['./medical-note-add-edit.component.css'],
})
export class MedicalNoteAddEditComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU KHÁM BỆNH";
  TRANG_THAI_PHIEU_KHAM = TRANG_THAI_PHIEU_KHAM;
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
      check: [false],
      heartbeat: [], //nhịp tim
      weight: [], //cân nặng
      breathing: [], //nhịp thở
      temperature: [], //nhiệt độ
      bloodPressure: [], //huyết áp
      height: [], //chiều cao
      drugAllergy: [''], //dị ứng thuốc
      locked: [false],
      isDeb: [false], //nợ
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
    if(this.idUrl){
      let data = await this.detail(this.idUrl)
      console.log(data);
      data.idServiceExam = data.idServiceExam < 0 ? 0 : data.idServiceExam;
      data.clinicCode = data.clinicCode < 0 ? 0 : data.clinicCode;
      if (data.idPatient > 0) {
        this.listKhachHang$ = of([data.customer]);
      }
      this.formData.patchValue(data);
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
    this.thuocService.searchList({ 
      maNhaThuoc: this.getMaNhaThuocCha() != '' && this.getMaNhaThuocCha() != null ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      typeService: LOAI_SAN_PHAM.DICH_VU,
      tenNhomThuoc: 'Khám bệnh'
    }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        // this.listLoaiKham = res.data
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
      this.formData.patchValue({customer: $event});
      console.log($event);
    }
  }

  createUpdate() {
    let body = this.formData.value;
    body.diagnosticIds = body.chanDoanIds.join(',');
    this.save(body).then(res => {
      if (res) {
        //this.router.navigate(['/management/sample-note/list']);
      }
    });
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

  @ViewChildren('pickerNoteDate') pickerNoteDate!: Date;
  async onDateChange(date: Date) {
    let ngayTao = this.formData.get('ngayTao')?.value;
    this.formData.patchValue({ noteDate: this.datePipe.transform(ngayTao, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }
}