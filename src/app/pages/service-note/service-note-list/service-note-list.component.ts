import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {PhieuDichVuService} from "../../../services/medical/phieu-dich-vu.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {LOAI_SAN_PHAM, LOAI_THU_CHI} from "../../../constants/config";
import {SETTING} from "../../../constants/setting";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {STATUS_API} from "../../../constants/message";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {BacSiesService} from "../../../services/medical/bac-sies.service";
import {ThuocService} from "../../../services/products/thuoc.service";

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note-list.component.html',
  styleUrls: ['./service-note-list.component.css'],
})
export class ServiceNoteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách phiếu dịch vụ";
  displayedColumns = ['stt', 'noteNumber', 'barCode', 'created', 'createdByUseText', 'doctorName', 'customerName', 'description', 'isDeb', 'totalMoney', 'action'];
  listKhachHang$ = new Observable<any[]>;
  listNguoiThucHien$ = new Observable<any[]>;
  listBacSy$ = new Observable<any[]>;
  listDichVu$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  searchNguoiThucHienTerm$ = new Subject<string>();
  searchBacSyTerm$ = new Subject<string>();
  searchDichVuTerm$ = new Subject<string>();
  searchTypes = [
    { name: "Mã số phiếu", value: 0 },
    { name: "Bác sỹ chỉ định", value: 1 },
    { name: "Người thực hiện", value: 2 },
    { name: "Dịch vụ", value: 3 },
  ]
  // Settings
  disableTimeClinic = {
    activated:  this.authService.getSettingActivated(SETTING.DISABLE_TIME_CLINIC),
  };
  // Authorities
  noteServiceCreateAndWrite = true;
  noteServicePrint = true;
  noteServiceDelete = true

  constructor(
    injector: Injector,
    private _service: PhieuDichVuService,
    private khachHangService: KhachHangService,
    private userProfileService: UserProfileService,
    private bacSiesService: BacSiesService,
    private thuocService : ThuocService,
    private titleService: Title
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [null],
      storeCode: [this.getMaNhaThuoc()],
      idCus: [null],
      searchType: [null],
      noteNumber: [null], // searchType: 0
      idDoctor: [null], // searchType: 1
      performerId: [null], // searchType: 2
      serviceId: [null] // searchType: 3
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    this.getDataFilter();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getTongTien() {
    return this.dataSource.data.map((i: any) => i.totalMoney).reduce((acc, value) => acc + value, 0);
  }

  getDataFilter() {
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
    // Danh sách bác sĩ
    this.listBacSy$ = this.searchBacSyTerm$.pipe(
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
    // Search thuốc
    this.listDichVu$ = this.searchDichVuTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.getMaNhaThuoc(),
            typeService: LOAI_SAN_PHAM.DICH_VU
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
  }

  clearSearchTypeValue() {
    this.formData.patchValue({
      noteNumber: null, // searchType: 0
      idDoctor: null, // searchType: 1
      performerId: null, // searchType: 2
      serviceId: null // searchType: 3
    });
  }

  async onExport() {

  }

  async onPrint(printType: any) {

  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
