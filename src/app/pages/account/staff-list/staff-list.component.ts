import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {STATUS_API} from "../../../constants/message";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {MatDialog} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {
  AccountAddEditDialogComponent
} from "../../system/admin/account-add-edit-dialog/account-add-edit-dialog.component";
import {
  AccountResetPasswordDialogComponent
} from "../../system/admin/account-reset-password-dialog/account-reset-password-dialog.component";
import {StaffAddEditDialogComponent} from "../staff-add-edit-dialog/staff-add-edit-dialog.component";
import {StaffPermissionDialogComponent} from "../staff-permission-dialog/staff-permission-dialog.component";

@Component({
  selector: 'app-account',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
})
export class StaffListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhân viên";
  staffID: number = 0;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: UserProfileService,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenDayDu: [''],
      isNotActive: [false]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPageStaffManagement();
  }

  async searchPageStaffManagement() {
    let body = this.formData.value;
    body.hoatDong = !body.isNotActive;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageStaffManagement(body);
    if (res?.statusCode == STATUS_API.SUCCESS) {
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
    this.dialog.open(StaffPermissionDialogComponent, {
      data: userProfile,
      width: '600px',
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
