import {AfterViewInit, Component, EventEmitter, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {DATE_RANGE, LOAI_PHIEU, RECORD_STATUS} from "../../../constants/config";
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuKhamService} from "../../../services/medical/phieu-kham.service";
import {MedicalNoteHistoryTableComponent} from "./medical-note-history-table/medical-note-history-table.component";
import {ServiceNoteHistoryTableComponent} from "./service-note-history-table/service-note-history-table.component";
import {STATUS_API} from "../../../constants/message";
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {BenhBoYTeService} from "../../../services/medical/benh-bo-y-te.service";

@Component({
  selector: 'app-medical-note-history-list',
  templateUrl: './medical-note-history-list.component.html',
  styleUrls: ['./medical-note-history-list.component.css'],
})
export class MedicalNoteHistoryListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title = 'Lịch sử khám chữa bệnh';
  @ViewChild(MedicalNoteHistoryTableComponent) medicalNoteHistoryTableComponent?: MedicalNoteHistoryTableComponent;
  @ViewChild(ServiceNoteHistoryTableComponent) serviceNoteHistoryTableComponent?: ServiceNoteHistoryTableComponent;
  formDataChange = new EventEmitter();
  listDateType = [
    {name: 'Ngày khám', value: 0, dateControl: {fromDate: 'fromDateNote', toDate: 'toDateNote'}},
    {name: 'Ngày tái khám', value: 1, dateControl: {fromDate: 'fromDateReExamination', toDate: 'toDateReExamination'}},
  ];
  listNhomKhachHang = [];
  listKhachHang$ = new Observable<any[]>;
  listBenhBoYTe$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  searchBenhBoYTeTerm$ = new Subject<string>();
  currentDateControl: any;

  constructor(
    injector: Injector,
    private _service: PhieuKhamService,
    private nhomKhachHangService: NhomKhachHangService,
    private khachHangService: KhachHangService,
    private benhBoYTeService: BenhBoYTeService,
    private titleService: Title
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      storeCode: [this.getMaNhaThuoc()],
      noteTypeId: [LOAI_PHIEU.PHIEU_KHAM_BENH],
      recordStatusId: [RECORD_STATUS.ACTIVE],
      idPatient: [null],
      maNhomKhachHang: [null],
      diagnosticId: [null],
      dateType: [0],
      customer: [null]
    });
    this.currentDateControl = this.listDateType[0].dateControl;
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    this.route.queryParams.subscribe(async params => {
      const customerId = params['customerId'];
      if (customerId) {
        let res = await this.khachHangService.getDetail(customerId);
        if (res?.status == STATUS_API.SUCCESS){
          this.formData.patchValue({
            idPatient: res.data.id,
            customer: res.data
          });
        }
      }
      await this.searchPage();
    });
  }

  getDataFilter() {
    // Nhóm khách hàng
    this.nhomKhachHangService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomKhachHang = res.data;
      }
    });
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
            maNhaThuoc: this.authService.getNhaThuoc()?.maNhaThuoc,
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
    // Search bệnh bộ y tế
    this.listBenhBoYTe$ = this.searchBenhBoYTeTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
          };
          return from(this.benhBoYTeService.searchPage(body).then((res) => {
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

  onKhachHangSelectChange($event: any) {
    this.formData.patchValue({
      customer: $event
    })
  }

  override async searchPage() {
    this.formDataChange.emit(this.formData.value);
    await this.medicalNoteHistoryTableComponent?.searchPage();
    await this.serviceNoteHistoryTableComponent?.searchPage();
  }

  getFromDateControlName() {
    return this.listDateType[this.formData.get('dateType')?.value].dateControl.fromDate;
  }

  getToDateControlName() {
    return this.listDateType[this.formData.get('dateType')?.value].dateControl.toDate;
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getNoteType() {
    return this.formData.get('noteTypeId')?.value;
  }

  setNoteType(noteTypeId: any) {
    this.formData.get('noteTypeId')?.setValue(noteTypeId);
  }

  refreshDateControl($event: any) {
    // Lấy control mới
    const newDateControl = $event.dateControl;
    // Lấy giá trị của fromDate và toDate cũ
    const fromDateValue = this.formData.get(this.currentDateControl.fromDate)?.value;
    const toDateValue = this.formData.get(this.currentDateControl.toDate)?.value;
    // Xoá control cũ
    this.formData.removeControl(this.currentDateControl.fromDate);
    this.formData.removeControl(this.currentDateControl.toDate);
    // Thêm control mới
    this.formData.addControl(newDateControl.fromDate, this.fb.control(fromDateValue));
    this.formData.addControl(newDateControl.toDate, this.fb.control(toDateValue));
    // Ghi nhận control mới
    this.currentDateControl = newDateControl;
  }

  async onExport() {
    if(this.formData.get('noteTypeId')?.value == LOAI_PHIEU.PHIEU_KHAM_BENH){
      this.medicalNoteHistoryTableComponent?.export('danh-sach-phieu-kham-benh.xlsx');
    }
    if(this.formData.get('noteTypeId')?.value == LOAI_PHIEU.PHIEU_DICH_VU){
      this.serviceNoteHistoryTableComponent?.export('danh-sach-phieu-dich-vu.xlsx');
    }
  }

  protected readonly LOAI_PHIEU = LOAI_PHIEU;
}
