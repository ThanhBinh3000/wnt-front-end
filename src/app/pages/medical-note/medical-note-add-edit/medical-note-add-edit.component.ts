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
  
  deviceType: number = 0;

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
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      noteDate: [this.datePipe.transform(moment().utc().startOf('day').toDate(), 'dd/MM/yyyy HH:mm:ss')],
      ngayTao: [],
      statusNote: [TRANG_THAI_PHIEU_KHAM.DANG_KHAM],
      idPatient: [],
      patient: [{}],
    });
  }

  ngOnInit() {
    this.getDataFilter();
    this.titleService.setTitle(this.title);
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
  }

  getListBacSies() {
    this.bacSiesService.searchList({ maNhaThuoc: this.useDoctorCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc() }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listBacSies = res.data
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
      this.formData.patchValue({patient: $event});
      console.log(this.formData.value?.patient);
    }
  }

  async openCustomerAddEditDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.listKhachHang$ = of([result]);
        this.formData.patchValue({ idPatientId: result.id });
      }
    });
  }

  @ViewChildren('pickerNoteDate') pickerNoteDate!: Date;
  async onDateChange(date: Date) {
    let ngayTao = this.formData.get('ngayTao')?.value;
    this.formData.patchValue({ noteDate: this.datePipe.transform(ngayTao, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }
}