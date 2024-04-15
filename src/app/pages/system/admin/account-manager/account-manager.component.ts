import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserProfileService} from "../../../../services/system/user-profile.service";
import {MatDialog} from "@angular/material/dialog";
import {BaseComponent} from "../../../../component/base/base.component";
import {STATUS_API} from "../../../../constants/message";
import {AccountAddEditDialogComponent} from "../account-add-edit-dialog/account-add-edit-dialog.component";
import {
  AccountResetPasswordDialogComponent
} from "../account-reset-password-dialog/account-reset-password-dialog.component";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'account-manager',
  templateUrl: './account-manager.component.html',
  styleUrl: './account-manager.component.css'
})
export class AccountManagerComponent extends BaseComponent implements OnInit, AfterViewInit {
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
  drugStores = [
    {
      code: '0010',
      name: 'Công ty TNHH Web Nhà Thuốc',
      fullInfo: `0010 - Công ty TNHH Web Nhà Thuốc - Số 133, Yên Duyên, Yên Sở, Hoàng Mai, Hà Nội - Admin1`
    },
    {
      code: '0011',
      name: 'Chi nhánh công ty TNHH Web Nhà Thuốc',
      fullInfo: `0011 - Chi nhánh công ty TNHH Web Nhà Thuốc - Ba Vì, Hà Nội - Chủ quầy thuốc`
    },
    {
      code: '0013',
      name: 'QT Thủy Tiên CL',
      fullInfo: `0013 - QT Thủy Tiên CL - Tiền Giang - Web Nhà Thuốc`
    },
  ];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: UserProfileService,
    // private dialog: MatDialog
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
    await this.searchPageUserManagement();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  async searchPageUserManagement() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageUserManagement(body);
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

  async openRegionalDetailDialog(userProfile: any) {

  }
}
