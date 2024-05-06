import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserProfileService} from "../../../services/system/user-profile.service";
import {BaseComponent} from "../../../component/base/base.component";
import {STATUS_API} from "../../../constants/message";
import {AccountAddEditDialogComponent} from "../account-add-edit-dialog/account-add-edit-dialog.component";
import {
  AccountResetPasswordDialogComponent
} from "../account-reset-password-dialog/account-reset-password-dialog.component";
import {MatSort} from "@angular/material/sort";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {
  RegionInformationEditDialogComponent
} from "../../utilities/region-information-edit-dialog/region-information-edit-dialog.component";

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css'
})
export class AccountListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Quản lý tài khoản người dùng";
  displayedColumns = [
    '#',
    'userName',
    'tenDayDu',
    'email',
    'nhomQuyens',
    'nhaThuocs',
    'hoatDong',
    'permissions',
    'action'
  ];
  listNhaThuoc$ = new Observable<any[]>;
  searchNhaThuocTerm$ = new Subject<string>();

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: UserProfileService,
    private nhaThuocsService: NhaThuocsService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      userName: [''],
      roleName: [null],
      maNhaThuoc: [null],
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
    this.listNhaThuoc$ = this.searchNhaThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            hoatDong: true
          };
          return from(this.nhaThuocsService.searchPage(body).then((res) => {
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

  override async searchPage() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageUserManagement(body);
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

  trackByFn(item: any) {
    return item.id;
  }

  getUserId() {
    return this.authService.getUser()?.id;
  }

  getDisplayedNhaThuocs(nhaThuocs: any) {
    return nhaThuocs.replace(/,/g, '<br> ');
  }

  async openAddEditDialog(userProfile: any) {
    const dialogRef = this.dialog.open(AccountAddEditDialogComponent, {
      data: userProfile,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openResetPasswordDialog(userProfile: any) {
    const dialogRef = this.dialog.open(AccountResetPasswordDialogComponent, {
      data: userProfile,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openRegionInformationEditDialog(data: any) {
    const dialogRef = this.dialog.open(RegionInformationEditDialogComponent, {
      data: { id: data.id, controller: 'nguoi-dung' },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        data.address = result.address;
        data.regionId = result.regionId;
        data.cityId = result.cityId;
        data.wardId = result.wardId;
      }
    });
  }
}
