import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from '../../../component/base/base.component';
import {MatSort} from '@angular/material/sort';
import {MESSAGE, STATUS_API} from '../../../constants/message';
import {LOAI_THUOC_LIEN_THONG, RECORD_STATUS} from "../../../constants/config";
import {ConnectivityDrugService} from "../../../services/products/connectivity-drug.service";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {NgSelectComponent} from "@ng-select/ng-select";
import {DrugDetailDialogComponent} from "../drug-detail-dialog/drug-detail-dialog.component";
import {
  CustomerGroupAddEditDialogComponent
} from "../../customer-group/customer-group-add-edit-dialog/customer-group-add-edit-dialog.component";
import {
  DrugConnectAddEditDialogComponent
} from "../drug-connect-add-edit-dialog/drug-connect-add-edit-dialog.component";

@Component({
  selector: 'drug-connect-list',
  templateUrl: './drug-connect-list.component.html',
  styleUrls: ['./drug-connect-list.component.css'],
})
export class DrugConnectListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Thiết lập danh sách thuốc liên thông";
  displayedColumns = [
    '#',
    'maThuoc',
    'tenThuoc',
    'retailUnitName',
    'name',
    'registeredNo',
    'connectivityCode',
    'action'
  ];
  listLoaiThuoc: any[] = [
    {id: LOAI_THUOC_LIEN_THONG.TAT_CA, name: '--Tất cả--'},
    {id: LOAI_THUOC_LIEN_THONG.CHUA_LIEN_THONG, name: 'Chưa liên thông'},
    {id: LOAI_THUOC_LIEN_THONG.DA_LIEN_THONG_QUOC_GIA, name: 'Đã liên thông quốc gia'},
    {id: LOAI_THUOC_LIEN_THONG.DA_LIEN_THONG_CO_SO, name: 'Đã liên thông cơ sở'},
  ];
  listConnectivityDrug$ = new Observable<any[]>;
  searchConnectivityDrugTerm$ = new Subject<string>();
  // Settings
  // Authorities

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ConnectivityDrugService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      loaiThuocLienThong: [LOAI_THUOC_LIEN_THONG.TAT_CA],
      textSearch: [null],
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    await this.searchPage();
    this.dataSource.sort = this.sort!;
  }

  override async searchPage() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageThuocLienThong(body);
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

  override async delete(item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: 'Xoá thiết lập liên thông của thuốc này?',
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        let body = {drugId: item.drugId}
        this.service.delete(body).then(async (res) => {
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, "Xóa thiết lập LT thành công.");
            await this.searchPage();
          }
        });
      },
    });
  }

  getDataFilter() {
    //Search thuốc quốc gia
    this.listConnectivityDrug$ = this.searchConnectivityDrugTerm$.pipe(
      debounceTime(500),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
          };
          return from(this._service.searchPage(body).then((res) => {
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

  updateEditConnectivityDrug(item: any) {
    this.dataTable.forEach((element: any) => {
      element.isEditConnectivityDrug = false;
    });
    item.isEditConnectivityDrug = true;
    this.focusSearchConnectivityDrug();
  }

  async saveEdit(item: any, newConnectivityDrug: any) {
    if (newConnectivityDrug) {
      const { id, drugId, ...restOfNewConnectivityDrug } = newConnectivityDrug;
      const body = { ...item, ...restOfNewConnectivityDrug };
      let result = await super.save(body)
      if (result) await this.searchPage();
    }
  }

  @ViewChild('selectConnectivityDrug') selectConnectivityDrug!: NgSelectComponent;

  focusSearchConnectivityDrug() {
    setTimeout(() => this.selectConnectivityDrug?.focus(), 100);
  }

  openDrugDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async openAddEditDialog(item: any) {
    const dialogRef = this.dialog.open(DrugConnectAddEditDialogComponent, {
      data: item,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  protected readonly RECORD_STATUS = RECORD_STATUS;
}
