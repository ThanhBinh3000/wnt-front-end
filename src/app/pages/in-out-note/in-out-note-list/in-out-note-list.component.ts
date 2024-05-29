import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from '../../../component/base/base.component';
import {KhachHangService} from '../../../services/customer/khach-hang.service';
import {NhaCungCapService} from '../../../services/categories/nha-cung-cap.service';
import {MatSort} from '@angular/material/sort';
import {PhieuThuChiService} from '../../../services/thuchi/phieu-thu-chi.service';
import {STATUS_API} from '../../../constants/message';
import {UserProfileService} from '../../../services/system/user-profile.service';
import {DATE_RANGE, LOAI_THU_CHI, RECORD_STATUS} from "../../../constants/config";
import {NavigationExtras} from "@angular/router";
import {
  OtherInOutNoteAddEditDialogComponent
} from "../other-in-out-note-add-edit-dialog/other-in-out-note-add-edit-dialog.component";
import {InOutNoteAddEditDialogComponent} from "../in-out-note-add-edit-dialog/in-out-note-add-edit-dialog.component";
import {SETTING} from "../../../constants/setting";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {
  OtherInOutNoteDetailDialogComponent
} from "../other-in-out-note-detail-dialog/other-in-out-note-detail-dialog.component";
import {InOutNoteDetailDialogComponent} from "../in-out-note-detail-dialog/in-out-note-detail-dialog.component";

@Component({
  selector: 'app-in-out-note',
  templateUrl: './in-out-note-list.component.html',
  styleUrls: ['./in-out-note-list.component.css'],
})
export class InOutNoteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tra cứu phiếu thu chi";
  displayedColumns = [
    '#',
    'soPhieu',
    'nguoiNhan',
    'ngayTao',
    'createdByUserText',
    'amount',
    'dienGiai',
    'httt',
    'action'
  ];
  listLoaiPhieu: any[] = [
    {id: LOAI_THU_CHI.THU_NO_KHACH_HANG, name: 'Phiếu thu nợ khách hàng'},
    {id: LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP, name: 'Phiếu chi trả nợ nhà cung cấp'},
    {id: LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP, name: 'Phiếu thu lại nhà cung cấp'},
    {id: LOAI_THU_CHI.CHI_TRA_LAI_KHACH_HANG, name: 'Phiếu chi trả lại khách hàng'},
    {id: LOAI_THU_CHI.THU_KHAC, name: 'Phiếu thu khác'},
    {id: LOAI_THU_CHI.CHI_KHAC, name: 'Phiếu chi khác'},
    {id: LOAI_THU_CHI.CHI_PHI_KINH_DOANH, name: 'Phiếu chi phí kinh doanh'},
  ];
  listKhachHang$ = new Observable<any[]>;
  listNCC$ = new Observable<any[]>;
  listNhanVien$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  searchNCCTerm$ = new Subject<string>();
  searchNhanVienTerm$ = new Subject<string>();
  // Settings
  enableCustomerToSupplier = this.authService.getSettingByKey(SETTING.ENABLE_CUSTOMER_TO_SUPPLIER);
  // Authorities
  inOutComingNoteWrite = true;
  inOutComingNoteDelete = true;
  inOutComingNoteRead = true;
  inOutComingNoteImportExcel = true;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuThuChiService,
    private userProfileService: UserProfileService,
    private khachHangService: KhachHangService,
    private nhaCungCapService: NhaCungCapService,
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      loaiPhieu: [LOAI_THU_CHI.THU_NO_KHACH_HANG],
      nhaThuocMaNhaThuoc: [this.getMaNhaThuoc()],
      soPhieu: [null],
      khachHangMaKhachHang: [null],
      nhaCungCapMaNhaCungCap: [null],
      createdByUserId: [null],
      nguoiNhan: [null],
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.route.queryParams.subscribe(params => {
      const loaiPhieu = params['loaiPhieu'];
      if (loaiPhieu) {
        this.formData.patchValue({
          loaiPhieu: Number(loaiPhieu)
        });
      }

      const addPhieu = params['addPhieu'];
      if (addPhieu) {
        this.openAddEditDialog(Number(addPhieu), null);
        let navigationExtras: NavigationExtras = {
          queryParams: {'addPhieu': null},
          queryParamsHandling: 'merge'
        };
        this.router.navigate([], navigationExtras);
      }
    });
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
    await this.searchPage();
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  clearSearchValue() {
    this.formData.patchValue({
      soPhieu: null,
      khachHangMaKhachHang: null,
      nhaCungCapMaNhaCungCap: null,
      createdByUserId: null,
      nguoiNhan: null,
    });
  }

  getTongTien() {
    return this.dataSource.data.map((i: any) => i.amount).reduce((acc, value) => acc + value, 0);
  }

  getTongTienMat() {
    return this.dataSource.data.filter((i: any) => i.paymentTypeId == 0).map((i: any) => i.amount).reduce((acc, value) => acc + value, 0);
  }

  getTongChuyenKhoan() {
    return this.dataSource.data.filter((i: any) => i.paymentTypeId == 0).map((i: any) => i.amount).reduce((acc, value) => acc + value, 0);
  }

  getLoaiPhieu() {
    return this.formData.get('loaiPhieu')?.value;
  }

  getDataFilter() {
    // Search nhân viên
    this.listNhanVien$ = this.searchNhanVienTerm$.pipe(
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
    // Search nhà cung cấp
    this.listNCC$ = this.searchNCCTerm$.pipe(
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
  }

  onImport() {

  }

  onExport() {

  }

  async openDetailDialog(loaiPhieu: number, id: any) {
    const config = {
      data: {loaiPhieu: loaiPhieu, id: id},
      width: '600px',
    };

    let dialogRef;
    if ([LOAI_THU_CHI.THU_KHAC, LOAI_THU_CHI.CHI_KHAC, LOAI_THU_CHI.CHI_PHI_KINH_DOANH].includes(loaiPhieu))
      dialogRef = this.dialog.open(OtherInOutNoteDetailDialogComponent, config);
    else
      dialogRef = this.dialog.open(InOutNoteDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openAddEditDialog(loaiPhieu: number, id: any) {
    const config = {
      data: {loaiPhieu: loaiPhieu, id: id},
      width: '600px',
    };

    let dialogRef;
    if ([LOAI_THU_CHI.THU_KHAC, LOAI_THU_CHI.CHI_KHAC, LOAI_THU_CHI.CHI_PHI_KINH_DOANH].includes(loaiPhieu))
      dialogRef = this.dialog.open(OtherInOutNoteAddEditDialogComponent, config);
    else
      dialogRef = this.dialog.open(InOutNoteAddEditDialogComponent, config);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  protected readonly RECORD_STATUS = RECORD_STATUS;
  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
