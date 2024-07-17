import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { STATUS_API } from '../../../constants/message';
import { SETTING } from '../../../constants/setting';
import { catchError, concat, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap } from "rxjs";
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { DoctorDetailDialogComponent } from '../../doctor/doctor-detail-dialog/doctor-detail-dialog.component';
import { CustomerDetailDialogComponent } from '../../customer/customer-detail-dialog/customer-detail-dialog.component';

@Component({
  selector: 'app-sample-note',
  templateUrl: './sample-note-list.component.html',
  styleUrls: ['./sample-note-list.component.css'],
})
export class SampleNoteListComponent extends BaseComponent implements OnInit {
  title: string = "DANH SÁCH KÊ ĐƠN/LIỀU MẪU";
  displayedColumns = ['stt', 'id', 'noteName', 'noteDate', 'barcode', 'doctor', 'customer', 'slThuoc', 'doctorComments', 'action'];
  listBacSy$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchBacSyTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();

  // Settings
  useDoctorCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  useSampleNoteFromParent = this.authService.getSettingByKey(SETTING.USE_SAMPLE_NOTE_FROM_PARENT);
  useClinicIntegration = this.authService.getSettingByKey(SETTING.USE_CLINIC_INTEGRATION);

  //Permit
  permittedFields = {
    sampleNote_Delete: true,
  };

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: SampleNoteService,
    private bacSiesService: BacSiesService,
    private khachHangService: KhachHangService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      maNhaThuoc: [this.useSampleNoteFromParent.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc()],
      noteName: [],
      patientId: [],
      doctorId: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    await this.searchPage();
    console.log(this.dataTable);
  }

  getDataFilter() {
    // Danh sách bác sĩ
    this.listBacSy$ = this.searchBacSyTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.useDoctorCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
          };
          return from(this.bacSiesService.searchPage(body).then((res) => {
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

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  trackByFn(item: any) {
    return item.id;
  }

  onTitleConnect(isConnect: boolean): string {
    return isConnect ? "Đã tạo đơn LT" : "Liên thông";
  }

  onGetConnectivity(noteId: number): void {
    // Logic để xử lý kết nối
    console.log('Connectivity for Note ID:', noteId);
  }

  async openDoctorDetailDialog(doctorId: any) {
    const dialogRef = this.dialog.open(DoctorDetailDialogComponent, {
      data: doctorId,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }

  async openCustomerDetailDialog(customerId: any) {
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, {
      data: customerId,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }
}
