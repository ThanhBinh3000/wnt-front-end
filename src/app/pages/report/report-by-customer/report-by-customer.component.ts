import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {PhieuDichVuService} from "../../../services/medical/phieu-dich-vu.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {DATE_RANGE, LOAI_SAN_PHAM, LOAI_THU_CHI} from "../../../constants/config";
import {SETTING} from "../../../constants/setting";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {STATUS_API} from "../../../constants/message";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {BacSiesService} from "../../../services/medical/bac-sies.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {CustomerDetailDialogComponent} from "../../customer/customer-detail-dialog/customer-detail-dialog.component";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'report-by-customer',
  templateUrl: './report-by-customer.component.html',
  styleUrls: ['./report-by-customer.component.css'],
})
export class ReportByCustomerComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Báo cáo theo khách hàng";
  displayedColumns = ['stt', 'noteNumber', 'barCode', 'created', 'createdByUseText', 'doctorName', 'customerName', 'description', 'isDeb', 'totalMoney'];
  listNhaThuoc: any[] = [];
  listKhachHangType: any[] = [
    {name: '--Tất cả--', value: 0},
    {name: 'Theo nhóm', value: 1},
    {name: 'Theo tên', value: 2},
  ];
  listNhomKhachHang$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  listNguoiThucHien$ = new Observable<any[]>;
  listBacSy$ = new Observable<any[]>;
  listDichVu$ = new Observable<any[]>;
  searchNhomKhachHangTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  searchNguoiThucHienTerm$ = new Subject<string>();
  searchBacSyTerm$ = new Subject<string>();
  searchDichVuTerm$ = new Subject<string>();
  searchTypes = [
    {name: "Mã số phiếu", value: 0},
    {name: "Bác sỹ chỉ định", value: 1},
    {name: "Người thực hiện", value: 2},
    {name: "Dịch vụ", value: 3},
  ]
  // Settings
  viewMultipleWarehousesFromReports = this.authService.getSettingByKey(SETTING.VIEW_MULTIPLE_WAREHOUSES_FROM_REPORTS);

  // Authorities


  constructor(
    injector: Injector,
    private _service: PhieuDichVuService,
    private nhaThuocsService: NhaThuocsService,
    private nhomKhachHangService: NhomKhachHangService,
    private khachHangService: KhachHangService,
    private decimalPipe: DecimalPipe,
    private titleService: Title
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      maNhaThuoc: [this.getMaNhaThuoc()],
      khachHangType: [0],
      minRevenue: [0],
      textSearch: [null],
      storeCode: [this.getMaNhaThuoc()],
      idCus: [null],
      searchType: [null],
      noteNumber: [null], // searchType: 0
      idDoctor: [null], // searchType: 1
      performerId: [null], // searchType: 2
      serviceId: [null], // searchType: 3
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
        if (res?.status == STATUS_API.SUCCESS) {
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

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getTongTien() {
    return this.dataSource.data.map((i: any) => i.totalMoney).reduce((acc, value) => acc + value, 0);
  }

  getDataFilter() {
    // Danh sách nhà thuốc quản lý
    if (this.viewMultipleWarehousesFromReports.activated) {
      this.nhaThuocsService.searchList({
        maNhaThuocCha: this.getMaNhaThuoc(),
        isConnectivity: false,
        hoatDong: true
      }).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listNhaThuoc = res.data;
          if (this.listNhaThuoc.length > 0) {
            // Select mã đầu tiên nếu list không tồn tại mã nhà thuốc hiện tại
            if (!this.listNhaThuoc.some((item: any) => item.maNhaThuoc == this.getMaNhaThuoc())) {
              this.formData.patchValue({maNhaThuoc: this.listNhaThuoc[0]?.maNhaThuoc});
            }
            // Thêm option tất cả
            this.listNhaThuoc.unshift({maNhaThuoc: 'ALL', tenNhaThuoc: '--Tất cả--'});
          }
        }
      });
    }
    // Search nhóm khách hàng
    this.listNhomKhachHang$ = this.searchNhomKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.nhomKhachHangService.searchPage(body).then((res) => {
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
            paggingReq: {limit: 25, page: 0},
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

  async onPrint(printType: any) {

  }

  async openCustomerDetailDialog(item: any) {
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, {
      data: item.id,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }

  getStatisticalComponent() {
    let digitsInfo = '1.0-0';
    return `
        <div class="row">
          <div class="col-md-3"><strong>Tổng nợ đầu kỳ: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
          <div class="col-md-3"><strong>Tổng bán: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
          <div class="col-md-3"><strong>Tổng lợi nhuận: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
          <div class="col-md-3"><strong>Tổng khách trả: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
        </div>
        <div class="row">
          <div class="col-md-3"></strong></div>
          <div class="col-md-3"><strong>Tổng trả ngay: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
          <div class="col-md-3"><strong>Tổng trả sau: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
          <div class="col-md-3"><strong>Tổng nợ: <span class="text-danger">${this.decimalPipe.transform(100000, digitsInfo)}</span></strong></div>
        </div>
    `;
  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
