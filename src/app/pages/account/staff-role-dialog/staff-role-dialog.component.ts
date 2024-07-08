import {ChangeDetectorRef, Component, Inject, Injector, OnInit} from '@angular/core';
import {UserProfileService} from "../../../services/system/user-profile.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {RoleService} from "../../../services/system/role.service";
import {RoleTypeService} from "../../../services/system/role-type.service";
import {StaffRoleAddEditDialogComponent} from "../staff-role-add-edit-dialog/staff-role-add-edit-dialog.component";

@Component({
  selector: 'staff-role-dialog',
  templateUrl: './staff-role-dialog.component.html',
  styleUrls: ['./staff-role-dialog.component.css'],
})
export class StaffRoleDialogComponent extends BaseComponent implements OnInit {
  public display: any = {};
  listRoles: any = [];
  userRole = [];
  roleTypes: any = [];
  user:any;
  constructor(
    injector: Injector,
    private _service: UserProfileService,
    private serviceRole: RoleService,
    private serviceRoleType: RoleTypeService,
    public dialogRef: MatDialogRef<StaffRoleDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, _service);
  }

  async ngOnInit() {
    if(this.data){
      this.user = this.data;
    }
    await this.searchListStaffManagement();
    await this.searchListRoles();
  }

  closeModal() {
    this.dialogRef.close();
  }
  async searchListStaffManagement() {
    let body = {};
    let res = await this.serviceRole.searchList(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.listRoles = res.data.filter((item:any) => 2 == item.roleTypeId || 3 == item.roleTypeId);
      for (let role of this.listRoles) {
        // @ts-ignore
        role['selected'] = false;
      }
      for (let r of this.listRoles) {
        if ((this.user.roles && this.user.roles.find((item: any) => item.id === r.id))) {
          // @ts-ignore
          this.userRole.push({roleId: r.id, userId: this.user.id});
        }
      }

    } else {
      this.listRoles = [];
    }
  }

  openAddRoleDialog() {
    const dialogRef = this.dialog.open(StaffRoleAddEditDialogComponent, {
      data: {dataUser: this.authService.getUser()},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchListStaffManagement();
      }
    });
  }

  async saveRole() {
    let body = {
      maNhaThuoc: this.authService.getMaNhaThuoc(),
      userId: this.user.id,
      roleIds: this.userRole.filter((userRole: any) => userRole.userId == this.user.id).map((m: any) => m.roleId)
    }
    let res = await this._service.changeRole(body);
    if (res) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      this.dialogRef.close(true);
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
              await this.searchListStaffManagement();
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

  openEditRoleDialog(item: any) {
    const dialogRef = this.dialog.open(StaffRoleAddEditDialogComponent, {
      data: {role: item, dataUser:this.authService.getUser()},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  getListRoles(): any {
    let roles: any = [];
    if (this.listRoles) {
      for (let role of this.listRoles) {
        // @ts-ignore
        let r = {...role};
        if (this.userRole && this.userRole.find((item: any) => item.roleId === r.id && this.user.id === item.userId)) {
          r.selected = true;
        }else {
          r.selected = false;
        }
        roles.push(r);
      }
      return roles;
    }
    return [];
  }

  updateRoles($event: any, item: any) {
    // console.log($event);
    // console.log(item);
    // console.log(data);
    if (!this.userRole.find((userRole: any) => (userRole.roleId == item.id && userRole.userId == this.user.id))) {
      // @ts-ignore
      this.userRole.push({roleId: item.id, userId: this.user.id});
    } else {
      this.userRole = this.userRole.filter((userRole: any) => !(userRole.roleId == item.id && userRole.userId == this.user.id))
    }
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
