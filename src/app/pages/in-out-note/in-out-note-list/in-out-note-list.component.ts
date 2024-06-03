import {AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
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
import {SETTING} from "../../../constants/setting";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {
  OtherInOutNoteDetailDialogComponent
} from "../other-in-out-note-detail-dialog/other-in-out-note-detail-dialog.component";
import {
  InComingCustomerNoteDetailDialogComponent
} from "../in-coming-customer-note-detail-dialog/in-coming-customer-note-detail-dialog.component";
import {
  OutReturnCustomerNoteDetailDialogComponent
} from "../out-return-customer-note-detail-dialog/out-return-customer-note-detail-dialog.component";
import {
  OutComingSupplierNoteDetailDialogComponent
} from "../out-coming-supplier-note-detail-dialog/out-coming-supplier-note-detail-dialog.component";
import {
  InReturnSupplierNoteDetailDialogComponent
} from "../in-return-supplier-note-detail-dialog/in-return-supplier-note-detail-dialog.component";
import {
  InComingCustomerNoteAddEditDialogComponent
} from "../in-coming-customer-note-add-edit-dialog/in-coming-customer-note-add-edit-dialog.component";
import {
  OutReturnCustomerNoteAddEditDialogComponent
} from "../out-return-customer-note-add-edit-dialog/out-return-customer-note-add-edit-dialog.component";
import {
  OutComingSupplierNoteAddEditDialogComponent
} from "../out-coming-supplier-note-add-edit-dialog/out-coming-supplier-note-add-edit-dialog.component";
import {
  InReturnSupplierNoteAddEditDialogComponent
} from "../in-return-supplier-note-add-edit-dialog/in-return-supplier-note-add-edit-dialog.component";

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
    private cdRef: ChangeDetectorRef
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      loaiPhieu: [LOAI_THU_CHI.THU_NO_KHACH_HANG],
      nhaThuocMaNhaThuoc: [this.getMaNhaThuoc()],
      soPhieu: [null],
      customerId: [null],
      supplierId: [null],
      createdByUserId: [null],
      nguoiNhan: [null],
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    const loaiPhieu = await this.getQueryParams('loaiPhieu');
    if(loaiPhieu) this.formData.patchValue({loaiPhieu: Number(loaiPhieu)});

    const taoPhieu = await this.getQueryParams('taoPhieu');
    if(taoPhieu) {
      await this.openAddEditDialog(Number(taoPhieu), null);
      await this.removeQueryParams('taoPhieu');
    }
    await this.searchPage();
    this.dataSource.sort = this.sort!;
    this.cdRef.detectChanges();
  }

  override async searchPage() {
    await this.updateQueryParams('loaiPhieu', this.formData.value?.loaiPhieu);
    await super.searchPage();
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  clearSearchValue() {
    this.formData.patchValue({
      soPhieu: null,
      customerId: null,
      supplierId: null,
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
    return this.dataSource.data.filter((i: any) => i.paymentTypeId == 1).map((i: any) => i.amount).reduce((acc, value) => acc + value, 0);
  }

  getLoaiPhieu() {
    return this.formData.get('loaiPhieu')?.value;
  }

  getNguoiNhanHeader() {
    let header = '';
    switch (this.getLoaiPhieu()) {
      case LOAI_THU_CHI.THU_NO_KHACH_HANG:
      case LOAI_THU_CHI.CHI_TRA_LAI_KHACH_HANG:
        header = 'Khách hàng';
        break;
      case LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP:
      case LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP:
        header = 'Nhà cung cấp';
        break;
      case LOAI_THU_CHI.THU_KHAC:
        header = 'Người nộp';
        break;
      case LOAI_THU_CHI.CHI_KHAC:
      case LOAI_THU_CHI.CHI_PHI_KINH_DOANH:
        header = 'Người nhận';
        break;
    }
    return header;
  }

  getNguoiNhanData(data: any) {
    let nguoiNhan = '';
   switch (this.getLoaiPhieu()) {
      case LOAI_THU_CHI.THU_NO_KHACH_HANG:
      case LOAI_THU_CHI.CHI_TRA_LAI_KHACH_HANG:
        nguoiNhan = data.customerText;
        break;
      case LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP:
      case LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP:
        nguoiNhan = data.nhaCungCapMaNhaCungCapText;
        break;
      case LOAI_THU_CHI.THU_KHAC:
      case LOAI_THU_CHI.CHI_KHAC:
      case LOAI_THU_CHI.CHI_PHI_KINH_DOANH:
        nguoiNhan = this.is9274() ? data.nhanVienText : data.nguoiNhan;
        break;
   }
    return nguoiNhan;
  }

  is9274() {
    return this.getMaNhaThuoc() == '9274';
  }

  getDataFilter() {
    // Search nhân viên
    this.listNhanVien$ = this.searchNhanVienTerm$.pipe(
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
    // Search nhà cung cấp
    this.listNCC$ = this.searchNCCTerm$.pipe(
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
    switch (loaiPhieu) {
      case LOAI_THU_CHI.THU_NO_KHACH_HANG:
        dialogRef = this.dialog.open(InComingCustomerNoteDetailDialogComponent, config);
        break;
      case LOAI_THU_CHI.CHI_TRA_LAI_KHACH_HANG:
        dialogRef = this.dialog.open(OutReturnCustomerNoteDetailDialogComponent, config);
        break;
      case LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP:
        dialogRef = this.dialog.open(OutComingSupplierNoteDetailDialogComponent, config);
        break;
      case LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP:
        dialogRef = this.dialog.open(InReturnSupplierNoteDetailDialogComponent, config);
        break;
      case LOAI_THU_CHI.THU_KHAC:
      case LOAI_THU_CHI.CHI_KHAC:
      case LOAI_THU_CHI.CHI_PHI_KINH_DOANH:
      default:
        dialogRef = this.dialog.open(OtherInOutNoteDetailDialogComponent, config);
        break;
    }

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
    switch (loaiPhieu) {
      case LOAI_THU_CHI.THU_NO_KHACH_HANG:
        dialogRef = this.dialog.open(InComingCustomerNoteAddEditDialogComponent, config);
        break;
      case LOAI_THU_CHI.CHI_TRA_LAI_KHACH_HANG:
        dialogRef = this.dialog.open(OutReturnCustomerNoteAddEditDialogComponent, config);
        break;
      case LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP:
        dialogRef = this.dialog.open(OutComingSupplierNoteAddEditDialogComponent, config);
        break;
      case LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP:
        dialogRef = this.dialog.open(InReturnSupplierNoteAddEditDialogComponent, config);
        break;
      case LOAI_THU_CHI.THU_KHAC:
      case LOAI_THU_CHI.CHI_KHAC:
      case LOAI_THU_CHI.CHI_PHI_KINH_DOANH:
      default:
        dialogRef = this.dialog.open(OtherInOutNoteAddEditDialogComponent, config);
        break;
    }

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  protected readonly RECORD_STATUS = RECORD_STATUS;
  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
