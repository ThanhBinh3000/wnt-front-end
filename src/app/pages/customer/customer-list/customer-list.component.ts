import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {KhachHangService} from '../../../services/customer/khach-hang.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {BaseComponent} from '../../../component/base/base.component';
import {CustomerAddEditDialogComponent} from '../customer-add-edit-dialog/customer-add-edit-dialog.component';
import {NhomKhachHangService} from '../../../services/categories/nhom-khach-hang.service';
import {MESSAGE, STATUS_API} from '../../../constants/message';
import {NhaThuocsService} from '../../../services/system/nha-thuocs.service';
import {
  RegionInformationEditDialogComponent
} from '../../utilities/region-information-edit-dialog/region-information-edit-dialog.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { SETTING } from '../../../constants/setting';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách khách hàng";
  
  listNhomKhachHang: any[] = [];
  listNguoiQuanTamOA$ = new Observable<any[]>;
  searchDSNguoiQuanTamTerm$ = new Subject<string>();
  listNhaThuocDongBo$ = new Observable<any[]>;
  searchNhaThuocDongBoTerm$ = new Subject<string>();
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  count: any = 1;
  isDeleted: boolean = false;

  autoSynchronizeDeliveryNote = this.authService.getSettingByKey(SETTING.AUTO_SYNCHRONIZE_DELIVERY_NOTE);
  showMappingZaloOA = this.authService.getNhaThuoc().tokenZalo

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: KhachHangService,
    private nhomKhachHangService: NhomKhachHangService,
    private nhaThuocService: NhaThuocsService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: '',
      dataDelete: [false],
      cusType: [],
      maNhomKhachHang: '',
      id: []
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    await this.searchPage();
  }
  
  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDataFilter() {
    // Nhóm khách hàng
    this.nhomKhachHangService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomKhachHang = res.data;
        this.listNhomKhachHang.unshift({id: '', tenNhomKhachHang: 'Tất cả'});
      }
    });
    
    //search kh
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyKhachHang = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
          };
          return from(this._service.searchPage(bodyKhachHang).then((res) => {
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

    //search ngươi quan tam
    this.listNguoiQuanTamOA$ = this.searchDSNguoiQuanTamTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body: any = {
            paggingReq: {
              limit: 25,
              page: 0
            },
            userName: term
          };
          return from(this._service.searchPageNguoiQuanTamOA(body).then((res) => {
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
    //search nha thuoc dong bo
     //search ngươi quan tam
     this.listNhaThuocDongBo$ = this.searchNhaThuocDongBoTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body: any = {
            paggingReq: {
              limit: 25,
              page: 0
            },
            tenNhaThuoc: term
          };
          return from(this.nhaThuocService.searchPageNhaThuocDongBoPhieu(body).then((res) => {
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

  async updateMappingZaloOA(data: any, customerId: any) {
    if (!data.id) return;
    let body: any = {
      maKhachHang: customerId,
      zaloId: data.userId
    };
    this._service.updateMappingZaloOA(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS && res.data > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
      }
    });
  }

  async updateMappingStore(data: any, customerId: any) {
    if (!data.id) return;
    let body: any = {
      maKhachHang: customerId,
      mappingStoreId: data.id
    };
    this._service.updateMappingMappingStore(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS && res.data > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
      }
    });
  }

  async openAddEditDialog(customer: any) {
    customer.isMinimized =  false;
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      data: customer,
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openRegionInformationEditDialog(data: any) {
    this.dialog.open(RegionInformationEditDialogComponent, {
      data: { id: data.id, controller: 'khach-hangs' },
      width: '600px',
    });
  }

  getDisplayColumn(){
    let displayedColumns = [
      '#',
      'code',
      'tenKhachHang',
      'tenNhomKhachHang',
      'soDienThoai',
      'ngaySinh',
      'barcode',
      'created',
      'mappingStoreId',
      'zaloId',
      'action'
    ];
    if(!this.autoSynchronizeDeliveryNote.activated){
      displayedColumns = displayedColumns.filter(x=>x != 'mappingStoreId');
    }
    if(!this.showMappingZaloOA){
      displayedColumns = displayedColumns.filter(x=>x != 'zaloId');
    }
    return displayedColumns;
  }
}
