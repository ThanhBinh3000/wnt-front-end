import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserProfileService} from "../../../services/system/user-profile.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MESSAGE, STATUS_API} from "../../../constants/message";
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
import {RoleService} from "../../../services/system/role.service";
import {RoleAddEditDialogComponent} from "../role-add-edit-dialog/role-add-edit-dialog.component";
import {RoleTypeService} from "../../../services/system/role-type.service";

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
  listRoles: any = [];
  show = [];
  userRole = [];
  listNhaThuoc$ = new Observable<any[]>;
  searchNhaThuocTerm$ = new Subject<string>();
  roleTypes: any = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: UserProfileService,
    private serviceRole: RoleService,
    private serviceRoleType: RoleTypeService,
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
    await this.searchListUserManagement();
    await this.searchListRoles();
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
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
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

  async searchListUserManagement() {
    let body = {};
    let res = await this.serviceRole.searchList(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.listRoles = res.data;
      for (let role of this.listRoles) {
        // @ts-ignore
        role['selected'] = false;
      }
      console.log(this.listRoles);
      for (let data of this.dataTable) {
        for (let r of this.listRoles) {
          if ((data.roles && data.roles.find((item: any) => item.id === r.id))) {
            // @ts-ignore
            this.userRole.push({roleId: r.id, userId: data.id});
          }
        }
      }

    } else {
      this.listRoles = [];
    }
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
    return nhaThuocs?.replace(/,/g, '<br> ');
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
      data: {id: data.id, controller: 'nguoi-dung'},
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

  getListRoles(data: any): any {
    let roles: any = [];
    if (this.listRoles) {
      let lrs = this.listRoles.filter((item: any) => item.isDefault || (data.maNhaThuocs && data.maNhaThuocs.filter((mnt: any) => mnt == item.maNhaThuoc)));
      for (let role of lrs) {
        // @ts-ignore
        let r = {...role};
        if (this.userRole && this.userRole.find((item: any) => item.roleId === r.id && data.id === item.userId)) {
          r.selected = true;
        }
        roles.push(r);
      }
      return roles;
    }
    return this.listRoles;
  }

  showCheckboxes(data: any) {
    if (this.show[data.id]) {
      // @ts-ignore
      this.show[data.id] = false
    } else {
      // @ts-ignore
      this.show[data.id] = true
    }
  }

  isShow(data: any) {
    if (this.show[data.id]) {
      return this.show[data.id];
    }
    return false;
  }

  updateRoles($event: any, item: any, data: any) {
    // console.log($event);
    // console.log(item);
    // console.log(data);
    if (!this.userRole.find((userRole: any) => (userRole.roleId == item.id && userRole.userId == data.id))) {
      // @ts-ignore
      this.userRole.push({roleId: item.id, userId: data.id});
    } else {
      this.userRole = this.userRole.filter((userRole: any) => !(userRole.roleId == item.id && userRole.userId == data.id))
    }
  }

  deleteRole(message: string, item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: !message ? 'Bạn có chắc chắn muốn xóa?' : message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        try {
          let body = {
            id: item.id
          }
          this.serviceRole.delete(body).then(async (res) => {
            if (res && res.data) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.searchListUserManagement();
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async saveRole(data: any) {
    let body = {
      userId: data.id,
      roleIds: this.userRole.filter((userRole: any) => userRole.userId == data.id).map((m: any) => m.roleId)
    }
    let res = await this._service.changeRoleSystem(body);
    if (res) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
    }
  }

  openAddRoleDialog(dataUser: any) {
    const dialogRef = this.dialog.open(RoleAddEditDialogComponent, {
      data: {dataUser},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchListUserManagement();
      }
    });
  }

  openEditRoleDialog(item: any, dataUser: any) {
    const dialogRef = this.dialog.open(RoleAddEditDialogComponent, {
      data: {role: item, dataUser},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  onChangeRoleType($event: Event) {

  }

  async searchListRoles() {
    let body = {};
    let res = await this.serviceRoleType.searchList(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.roleTypes = res.data;
    } else {
      this.roleTypes = [];
    }
  }
}
