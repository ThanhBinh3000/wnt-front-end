import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuKhamService} from "../../../services/medical/phieu-kham.service";
import {MatSort} from "@angular/material/sort";
import {DATE_RANGE, LOAI_THU_CHI, TRANG_THAI_PHIEU_KHAM} from "../../../constants/config";
import {SETTING} from "../../../constants/setting";
import {
  MedicalNoteWaitAddEditDialogComponent
} from "../medical-note-wait-add-edit-dialog/medical-note-wait-add-edit-dialog.component";
import {CustomerDetailDialogComponent} from "../../customer/customer-detail-dialog/customer-detail-dialog.component";
import {AppDatePipe} from "../../../component/pipe/app-date.pipe";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {PhieuDichVuService} from "../../../services/medical/phieu-dich-vu.service";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {
  CustomerAddEditDialogComponent
} from "../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component";
import {calculateAge} from "../../../utils/date.utils";

@Component({
  selector: 'app-medical-note-list',
  templateUrl: './medical-note-list.component.html',
  styleUrls: ['./medical-note-list.component.css'],
})
export class MedicalNoteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = '';
  isWaitList: boolean = false;
  displayedColumns = [
    '#',
    'created',
    'orderWait',
    'noteNumber',
    'patientName',
    'createdByUseText',
    'reasonExamination',
    'doctorName',
    'statusNote',
    'isDeb',
    'tenDichVu',
    'action'
  ];
  listStatusNote = [
    {name: 'Chờ khám', value: TRANG_THAI_PHIEU_KHAM.CHO_KHAM},
    {name: 'Đang khám', value: TRANG_THAI_PHIEU_KHAM.DANG_KHAM},
    {name: 'Đã khám', value: TRANG_THAI_PHIEU_KHAM.DA_KHAM},
    {name: 'Huỷ', value: TRANG_THAI_PHIEU_KHAM.DA_HUY},
    {name: 'Điều trị theo liệu trình', value: TRANG_THAI_PHIEU_KHAM.LIEU_TRINH},
  ];
  listPaymentStatus = [
    {name: 'Đã thanh toán', value: false},
    {name: 'Chưa thanh toán', value: true},
  ];
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  // Settings
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC);

  // Authorities
  waitNoteCreateAndWrite = true;
  waitNoteDeleteAndCancel = true;
  waitNotePrint = true;
  noteMedicalRead = true;
  noteMedicalCreateAndWrite = true;
  noteServiceCreateAndWrite = true;

  constructor(
    injector: Injector,
    private _service: PhieuKhamService,
    private phieuDichVuService: PhieuDichVuService,
    private khachHangService: KhachHangService,
    private titleService: Title
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      storeCode: this.authService.getNhaThuoc()?.maNhaThuoc,
      statusNote: [null],
      isDeb: [null],
      idPatient: [null],
      customer: [null]
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.isWaitList = data.isWaitList;
    });
    if(this.isWaitList){
      this.title = "Tiếp đón bệnh nhân";
    } else{
      this.title = "Danh sách phiếu khám";
      this.formData.patchValue({
        statusNote: TRANG_THAI_PHIEU_KHAM.CHO_KHAM,
      })
    }
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
            idPatient: res.data.id,
            customer: res.data
          });
        }
      }
      await this.searchPage();
      this.dataSource.sort = this.sort!;
    });
  }

  override async searchPage() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res;
    if(body.statusNote == TRANG_THAI_PHIEU_KHAM.LIEU_TRINH){
      res = await this.phieuDichVuService.searchPageLieuTrinh(body);
    } else{
      res = await this._service.searchPage(body);
    }
    if (res?.status == STATUS_API.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      this.totalPages = data.totalPages;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
    }
  }

  getDataFilter() {
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
  }

  onKhachHangSelectChange($event: any) {
    this.formData.patchValue({
      customer: $event
    })
  }

  getDisplayedColumns() {
    let columns = this.displayedColumns;
    if(this.isWaitList){
      columns = columns.filter((i: any) => !['doctorName', 'isDeb'].includes(i));
    }
    if(this.getStatusNote() == TRANG_THAI_PHIEU_KHAM.LIEU_TRINH){
      columns = columns.filter((i: any) => !['orderWait', 'noteNumber', 'createdByUseText', 'reasonExamination', 'statusNote', 'isDeb'].includes(i));
    } else {
      columns = columns.filter((i: any) => !['tenDichVu'].includes(i));
    }
    return columns;
  }

  getStatusNote() {
    return this.formData.get('statusNote')?.value;
  }

  getStatusName(status: any) {
    return this.listStatusNote.find((i: any) => i.value == status)?.name;
  }

  getRowColor(item: any) {
    return this.getStatusNote() != TRANG_THAI_PHIEU_KHAM.LIEU_TRINH || (item.countNumbers * item.amount - item.lastCountNumbers) > 0 ? '' : '#ffcccc';
  }

  onPrint(item: any) {

  }

  override async delete(message: string, item: any) {
    if(!item.isDeb){
      this.notification.error(MESSAGE.ERROR, 'Phiếu này đã thanh toán bạn không được xóa');
      return;
    }
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this.service.delete({id : item.id}).then(async (res) => {
          if(res && res.data){
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.searchPage();
          }
        });
      },
    });
  }

  override async cancel(message: string, item: any): Promise<void> {
    if(!item.isDeb){
      this.notification.error(MESSAGE.ERROR, 'Phiếu này đã thanh toán bạn không được hủy');
      return;
    }
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this.service.cancel({id : item.id}).then(async (res) => {
          if(res && res.data){
            this.notification.success(MESSAGE.SUCCESS, 'Huỷ thành công');
            await this.searchPage();
          }
        });
      },
    });
  }

  openAddEditNoteWaitDialog(data: any) {
    if(data){
      this.formData.patchValue({
        customer: data.customer,
        idPatient: data.customer.id
      })
    }
    let dialogRef = this.dialog.open(MedicalNoteWaitAddEditDialogComponent,
      {
        data: {
          id: data?.id,
          isWaitList: this.isWaitList,
        },
        width: '600px',
      });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openAddEditCustomerDialog(customer: any) {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      data: {...customer, isMinimized: true, isWaitList: this.isWaitList},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.formData.patchValue({
          customer: result,
          idPatient: result.id
        });
      }
    });
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

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
  protected readonly TRANG_THAI_PHIEU_KHAM = TRANG_THAI_PHIEU_KHAM;
  protected readonly calculateAge = calculateAge;
}
