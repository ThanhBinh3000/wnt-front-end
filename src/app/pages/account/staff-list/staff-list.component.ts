import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {STATUS_API} from "../../../constants/message";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {MatDialog} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {
  AccountAddEditDialogComponent
} from "../account-add-edit-dialog/account-add-edit-dialog.component";
import {
  AccountResetPasswordDialogComponent
} from "../account-reset-password-dialog/account-reset-password-dialog.component";
import {StaffAddEditDialogComponent} from "../staff-add-edit-dialog/staff-add-edit-dialog.component";
import {StaffRoleDialogComponent} from "../staff-role-dialog/staff-role-dialog.component";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-account',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
})
export class StaffListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách nhân viên";
  displayedColumns = ['#', 'tenDayDu', 'userName', 'soDienThoai', 'role', 'hoatDong', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: UserProfileService,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      isNotActive: [false]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  override async searchPage() {
    let body = this.formData.value;
    body.hoatDong = !body.isNotActive;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageStaffManagement(body);
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

  async openAddEditDialog(userProfile: any) {
    const dialogRef = this.dialog.open(StaffAddEditDialogComponent, {
      data: userProfile,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  async openPermissionDialog(userProfile: any) {
    const dialogRef = this.dialog.open(StaffRoleDialogComponent, {
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

}
