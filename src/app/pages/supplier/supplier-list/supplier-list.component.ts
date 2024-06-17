import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { MatSort } from '@angular/material/sort';
import { SupplierAddEditDialogComponent } from '../supplier-add-edit-dialog/supplier-add-edit-dialog.component';
import { SupplierRewardProgramDialogComponent } from '../supplier-reward-program-dialog/supplier-reward-program-dialog.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
})
export class SupplierListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách nhà cung cấp";
  displayedColumns = [
    '#',
    'code',
    'tenNhaCungCap',
    'tenNhomNhaCungCap',
    'diaChi',
    'soDienThoai',
    'barcode',
    'action'
  ];
  isDeleted : boolean = false;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhaCungCapService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: '',
      dataDelete: [false],
      id:[]
    });
  }

  listNhaCungCap$ = new Observable<any[]>;
  searchNhaCungCapTerm$ = new Subject<string>();

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }
  
  getDataFilter(){
    this.listNhaCungCap$ = this.searchNhaCungCapTerm$.pipe(
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
  }
  async openAddEditDialog(supplierID: any) {
    const dialogRef = this.dialog.open(SupplierAddEditDialogComponent, {
      data: supplierID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
  async openChuongTrinhKMDialog(data: any) {
    const dialogRef = this.dialog.open(SupplierRewardProgramDialogComponent, {
      data: data,
      width: '60%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}