import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserProfileService} from "../../../services/system/user-profile.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {TieuChiTrienKhaiService} from "../../../services/categories/tieu-chi-trien-khai.service";
import {DrugStoreAddEditDialogComponent} from "../drug-store-add-edit-dialog/drug-store-add-edit-dialog.component";
import {TinhThanhsService} from "../../../services/categories/tinh-thanhs.service";
import {DatePipe} from "@angular/common";
import {
  DrugStoreGeneralMappingDialogComponent
} from "../drug-store-general-mapping-dialog/drug-store-general-mapping-dialog.component";
import {TrienKhaiService} from "../../../services/categories/trien-khai.service";
import {TypeBasisService} from "../../../services/categories/type-basis.service";
import {
  RegionInformationEditDialogComponent
} from "../../utilities/region-information-edit-dialog/region-information-edit-dialog.component";
import moment from "moment/moment";
import {FormControl, FormGroup} from "@angular/forms";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'drug-store-trien-khai',
  templateUrl: './drug-store-trien-khai.component.html',
  styleUrl: './drug-store-trien-khai.component.css'
})
export class DrugStoreTrienKhaiComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Báo cáo triển khai";
  columnsKey = 'drug-store-trien-khai-columns';
  columnsControl = new FormControl();
  columns = [
    {name: 'STT', value: '#', display: true},
    {name: 'Ngày tạo TK', value: 'created', display: true},
    {name: 'Phân loại quầy', value: 'classify', display: true},
    {name: 'Mã', value: 'maNhaThuoc', display: true, },
    {name: 'Tên quầy', value: 'tenNhaThuoc', display: true},
    {name: 'Điện thoại', value: 'dienThoai', display: true},
    {name: 'Mã LT', value: 'connectivityCode', display: true},
    {name: 'Tải App', value: 'isUsedMobileApp', display: true},
    {name: 'Người TK', value: 'createdByUserName', display: true},
    {name: 'Tham chiếu DM', value: 'thamChieuDanhMuc', display: false},
    {name: 'SL thuốc trong DM', value: 'totalDrug', display: false},
    {name: 'Ngày giao dịch gần nhất', value: 'lastTransDate', display: false},
    {name: 'SL phiếu', value: 'totalNote', display: false},
    {name: 'Số lượt truy cập', value: 'totalVisit', display: false},
    {name: 'Tích điểm khách hàng', value: 'isScoreRate', display: false},
    {name: 'C.K nhân viên', value: 'isAdviseStaff', display: false},
    {name: 'SL nhân viên', value: 'totalStaff', display: false},
    {name: 'Chăm sóc sau bán hàng', value: 'supporterId', display: false},
    {name: 'Trạng thái triển khai', value: 'resultBusinessId', display: true},
    {name: 'Ghi chú', value: 'businessDescription', display: true},
    {name: 'Level', value: 'level', display: true},
    {name: 'Đánh giá', value: 'evaluate', display: true},
  ];
  storeTypes = [
    {name: "NT LT", value: 101, title: 'Báo cáo triển khai liên thông'},
    {name: "NT QL", value: 102, title: 'Báo cáo triển khai quản lý'},
    {name: "Phòng khám", value: 104, title: 'Báo cáo triển khai phòng khám'},
  ];
  storeClassifies = [
    {name: "Loại khác", value: 0},
    {name: "Loại 1", value: 1},
    {name: "Loại 2", value: 2},
    {name: "Loại 3", value: 3}
  ];
  storeEvaluates = [
    {name: "Chưa đánh giá", value: 0, backgroundColor: ''},
    {name: "Đạt", value: 1, backgroundColor: '#5cb85c'},
    {name: "Không đạt", value: 2, backgroundColor: 'rgb(217, 83, 79)'},
    {name: "Không dùng", value: 3, backgroundColor: 'rgb(194, 190, 178)'},
    {name: "Thay thế", value: 4, backgroundColor: '#5cb85c'},
    {name: "Bận/Không liên hệ", value: 5, backgroundColor: 'rgb(194, 190, 178)'},
  ];
  storeMobileAppUsedStatuses = [
    {name: "Chưa tải", value: 0},
    {name: "Đã tải", value: 1},
  ];
  drugStorePaymentTypes = [
    {name: "Chưa thanh toán", value: 0},
    {name: "Thanh toán chưa đủ", value: 1},
    {name: "Đã thanh toán", value: 2}
  ];
  filterTransactionType: any = 1;
  listSuperUser: any[] = [];
  listTieuChiTrienKhai: any[] = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhaThuocsService,
    private userProfileService: UserProfileService,
    private tieuChiTrienKhaiService: TieuChiTrienKhaiService,
    private trienKhaiService: TrienKhaiService,
    private tinhThanhsService: TinhThanhsService,
    private typeBasisService: TypeBasisService,
    private datePipe: DatePipe
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      storeTypeId: [102],
      createdByUserId: [null],
      storeDeployTypeId: [null],
      hoatDong: [true],
      storePaymentTypeId: [null],
      supporterId: [null],
      typeDate: [1],
      storeClassifyId: [null],
      storeEvaluateId: [null],
      storeMobileAppUsedStatusId: [null],
      pickerTransactionFromDate: [null],
      pickerTransactionToDate: [null],
      transactionFromDate: [null],
      transactionToDate: [null],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.getColumns();
    this.initTransactionDateRanges();
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  override async searchPage() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    if(this.filterType == 1){
      body.fromDate = this.fromDate;
      body.toDate = this.toDate;
    }
    if(this.filterTransactionType == 0){
      body.transactionFromDate = null;
      body.transactionToDate = null;
    }
    let res = await this._service.searchPageNhaThuocTrienKhai(body);
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

  getColumns() {
    const localColumns = this.storageService.get(this.columnsKey);
    if(localColumns){
      this.columns = localColumns.map((localCol: any) => {
        const column = this.columns.find(col => col.value === localCol.value);
        return column ? {...localCol, name: column.name} : localCol;
      });
    }
    this.columnsControl = new FormControl(this.getDisplayedColumns());
  }

  getDisplayedColumns() {
    let columns = this.columns.filter(col => col.display).map(col => col.value);
    if(this.formData.get('storeTypeId')?.value == 101) {
      columns = columns.filter(col => col != 'classify');
    } else {
      columns = columns.filter(col => col != 'connectivityCode');
    }
    return columns;
  }

  getDisplayedColumnsName(value: any) {
    return this.columns.filter(col => col.value == value).map(col => col.name);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.storageService.set(this.columnsKey, this.columns);
  }

  onChangeDisplayedColumns(value: any) {
    this.columns = this.columns.map(col => {
      if (col.value == value) {
        return {...col, display: !col.display};
      }
      return col;
    });
    this.storageService.set(this.columnsKey, this.columns);
  }

  refreshColumn() {
    this.storageService.removeItem(this.columnsKey);
    window.location.reload();
  }

  getCreatedByUserName(createdByUserId: any) {
    return this.listSuperUser.find(x => x.id == createdByUserId)?.tenDayDu;
  }

  getDataFilter() {
    // Danh sách tài khoản quyền hệ thống
    this.userProfileService.searchListUserManagement({roleName: 'SuperUser'}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listSuperUser = res.data;
      }
    });
    // Tiêu chí triển khai
    this.tieuChiTrienKhaiService.searchList({type: 0}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listTieuChiTrienKhai = res.data;
        this.listTieuChiTrienKhai.unshift({id: 0, name: "Chưa triển khai"});
      }
    });
  }

  async onResetSearching() {
    this.formData.reset();
    await this.searchPage();
  }

  getTitle() {
    return this.storeTypes.find(e => e.value == this.formData.get('storeTypeId')?.value)?.title ?? this.title;
  }

  onFilterTransactionTypeChange(filterTransactionType: number) {
    this.filterTransactionType = filterTransactionType;
    if (filterTransactionType == 1) {
      const fromDate = this.formData.get('pickerTransactionFromDate')?.value;
      const toDate = this.formData.get('pickerTransactionToDate')?.value;
      const transactionFromDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      const transactionToDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      this.formData.patchValue({
        transactionFromDate: transactionFromDate,
        transactionToDate: transactionToDate
      })
    }
  }

  onTransactionFromDateChange(fromDate: Date) {
    const toDate = this.formData.get('pickerTransactionToDate')?.value;
    let formattedDate = '';
    if (toDate && fromDate > toDate) {
      this.formData.get('pickerTransactionFromDate')?.setValue(toDate);
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    } else {
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.formData.patchValue({
      transactionFromDate: formattedDate
    });
  }

  onTransactionToDateChange(toDate: Date) {
    const fromDate = this.formData.get('pickerTransactionFromDate')?.value;
    let formattedDate = '';
    if (fromDate && toDate < fromDate) {
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    } else {
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.formData.patchValue({
      transactionToDate: formattedDate
    });
  }

  initTransactionDateRanges() {
    let toDate = moment().utc().startOf('day').toDate();
    let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    this.formData.patchValue({
      pickerTransactionFromDate: fromDate,
      pickerTransactionToDate: toDate,
      transactionFromDate: this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '',
      transactionToDate: this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? ''
    });
  }

  getBackgroundLastTransDate(value: any) {
    if (!value) return '';
    let lastTransDate = moment(value, 'DD/MM/YYYY HH:mm:ss').toDate();
    let now = new Date();
    let diff = now.getTime() - lastTransDate.getTime();
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays <= 3) {
      return 'rgb(217, 211, 92)';
    }
    return '';
  }

  getBackgroundEvaluate(value: any) {
    return this.storeEvaluates.find(e => e.value == value)?.backgroundColor ?? '';
  }

  async onClassifyChanged($event: any, item: any) {
    let body = item;
    item.classify = $event?.value;
    let res = await this.save(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async onEvaluateChanged($event: any, item: any) {
    let body = item;
    item.evaluate = $event?.value;
    let res = await this.save(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async onSupporterChanged($event: any, item: any) {
    let body = item;
    item.supporterId = $event?.id;
    let res = await this.save(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async onUpdateBusinessDescription(item: any) {
    let res = await this.save(item);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
    item.isEditBusinessDescription = false;
  }

  async onResultBusinessChanged($event: any, item: any) {
    let body = {
      maNhaThuoc: item.maNhaThuoc,
      tieuChiTrienKhaiId: $event?.id,
      active: true
    }
    let res = await this.trienKhaiService.create(body);
    if (res && res.status == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async openAddEditDialog(item: any) {
    const dialogRef = this.dialog.open(DrugStoreAddEditDialogComponent, {
      data: item,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
