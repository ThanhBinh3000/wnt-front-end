import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {PhieuDichVuService} from "../../../services/medical/phieu-dich-vu.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {DATE_RANGE, LOAI_SAN_PHAM, LOAI_THU_CHI, RECORD_STATUS} from "../../../constants/config";
import {SETTING} from "../../../constants/setting";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {BacSiesService} from "../../../services/medical/bac-sies.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {CustomerDetailDialogComponent} from "../../customer/customer-detail-dialog/customer-detail-dialog.component";
import {calculateAge} from "../../../utils/date.utils";
import {DrugDetailDialogComponent} from "../../drug/drug-detail-dialog/drug-detail-dialog.component";
import {ServiceDetailDialogComponent} from "../../service/service-detail-dialog/service-detail-dialog.component";
import {PhongKhamsService} from "../../../services/medical/phong-khams.service";

@Component({
  selector: 'app-service-note-wait-list',
  templateUrl: './service-note-wait-list.component.html',
  styleUrls: ['./service-note-wait-list.component.css'],
})
export class ServiceNoteWaitListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách dịch vụ chờ thực hiện";
  displayedColumns = ['stt', 'noteDate', 'noteNumber', 'customerName', 'doctorName', 'performerText', 'dichVu', 'status', 'action'];
  listStatus = [
    {name: 'Chưa làm', value: false},
    {name: 'Đã làm', value: true},
  ];
  listPhongKham = [];
  listKhachHang$ = new Observable<any[]>;
  listNguoiThucHien$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  searchNguoiThucHienTerm$ = new Subject<string>();
  // Settings
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC);
  // Authorities
  noteServiceCreateAndWrite = true;

  constructor(
    injector: Injector,
    private _service: PhieuDichVuService,
    private khachHangService: KhachHangService,
    private userProfileService: UserProfileService,
    private phongKhamsService: PhongKhamsService,
    private titleService: Title
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [null],
      storeCode: [this.getMaNhaThuoc()],
      recordStatusId: [RECORD_STATUS.ACTIVE],
      idStatus: [false],
      performerId: [null],
      idCus: [null],
      idClinic: [null],
      customer: [null]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.route.queryParams.subscribe(async params => {
      const customerId = params['customerId'];
      if (customerId) {
        let res = await this.khachHangService.getDetail(customerId);
        if (res?.status == STATUS_API.SUCCESS){
          this.formData.patchValue({
            idCus: res.data.id,
            customer: res.data
          });
        }
      }
      await this.searchPage();
      this.dataSource.sort = this.sort!;
    });
  }

  override async searchPage() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this._service.searchPageChoThucHien(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        this.totalPages = data.totalPages;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getDataFilter() {
    // Danh sách phòng khám
    this.phongKhamsService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPhongKham = res.data;
      }
    });
    // Danh sách nhân viên
    this.listNguoiThucHien$ = this.searchNguoiThucHienTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.formData.get('maNhaThuoc')?.value,
          };
          return from(this.userProfileService.searchPage(body).then((res) => {
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
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
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

  async onExport() {

  }

  openCustomerDetailDialog(item: any) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: item.id,
      width: '600px',
    });
  }

  openServiceDetailDialog(id: any) {
    this.dialog.open(ServiceDetailDialogComponent, {
      data: id,
      width: '600px',
    });
  }

  openKetQuaXetNghiem(item: any) {

  }

  openUpdateStatusServiceDialog(item: any) {

  }

  openCancelServiceDialog(item: any) {

  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
  protected readonly DATE_RANGE = DATE_RANGE;
  protected readonly calculateAge = calculateAge;
}
