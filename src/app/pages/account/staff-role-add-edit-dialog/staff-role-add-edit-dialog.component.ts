import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {Validators} from "@angular/forms";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {PrivilegeService} from "../../../services/system/privilege.service";
import {RoleTypeService} from "../../../services/system/role-type.service";
import {RoleService} from "../../../services/system/role.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {PrivilegeViewDialogComponent} from "../privilege-view-dialog/privilege-add-edit-dialog.component";

@Component({
  selector: 'role-add-edit-dialog',
  templateUrl: './staff-role-add-edit-dialog.component.html',
  styleUrl: './staff-role-add-edit-dialog.component.css'
})
export class StaffRoleAddEditDialogComponent extends BaseComponent implements OnInit {
  privilegeList: any = [];
  privilege: any = [];
  roleTypes: any = [];
  maNhaThuocs: any = [];

  constructor(
    injector: Injector,
    public roleService: RoleService,
    private privilegeService: PrivilegeService,
    public dialogRef: MatDialogRef<StaffRoleAddEditDialogComponent>,
    private serviceRoleType: RoleTypeService,
    private nhaThuocsService: NhaThuocsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, roleService);
    this.formData = this.fb.group({
      id: [],
      maNhaThuoc: [{value: undefined, disabled: true}],
      roleTypeId: [{ value: 3, disabled: true }],
      roleName: [undefined, (data && data.role) ? null : Validators.required],
      isDefault: [false]
    });
  }

  async ngOnInit() {
    if (this.data?.role) {
      const data = await this.detail(this.data.role.id);
      if (data) {
        this.data.role = Object.assign({}, this.data.role, data);
        this.formData.patchValue(this.data.role);
      }
    }
    if (this.data?.dataUser) {
      let body = {
        userId: this.data.dataUser.id
      }
      const res = await this.nhaThuocsService.searchListByNv(body);
      if (res) {
        this.maNhaThuocs = res.data;
      }
      this.formData.patchValue({maNhaThuoc: this.data?.dataUser.nhaThuoc.maNhaThuoc});
    }
    await this.searchListRoles();
    await this.searchListPrivilege();
  }

  isUpdateView() {
    return this.data?.role?.id;
  }

  async searchListPrivilege() {
    let res = await this.privilegeService.searchList({});
    if (res?.status == STATUS_API.SUCCESS) {
      this.privilegeList = [...res.data];
      this.privilege = res.data;
      let rt = this.roleTypes.find((item: any) => item.id == 3);
      if (rt) {
        this.privilege = this.privilegeList.filter((item: any) => item.entitys && item.entitys.find((e: any) => e.id == rt.entityId));
      }
      for (let p of this.privilege) {
        if (this.data?.role) {
          let pr = this.data.role.privileges.find((item: any) => item.id == p.id);
          if (pr) {
            p.selected = true;
          }
        }
      }
    }
  }

  override async save() {
    let body = this.formData.value;
    body.privileges = this.privilege.filter((item: any) => item.selected).map((m: any) => m.id);
    let res;
    if (body.id && body.id > 0) {
      res = await this.roleService.update(body);
    } else {
      res = await this.roleService.create(body);
    }
    if (res?.status == STATUS_API.SUCCESS) {
      if (body.id && body.id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    }
    if (res?.data) {
      this.dialogRef.close(res?.data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getListPrivilege() {
    return this.privilege;
  }

  updatePrivileges($event: any, item: any) {
    item.selected = !item.selected;
  }

  openViewPrivilegeDialog(event: MouseEvent, item: any) {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(PrivilegeViewDialogComponent, {
      data: item,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {

    });
  }

  changeRoleType($event: Event) {
    const target = $event.target as HTMLSelectElement;
    const value = target.value;
    if (value != "4") {
      let rt = this.roleTypes.find((item: any) => item.id == value);
      if (rt) {
        this.privilege = this.privilegeList.filter((item: any) => item.entitys && item.entitys.find((e: any) => e.id == rt.entityId));
      }
    } else {
      this.privilege = [...this.privilegeList];
    }
    if (!this.isUpdateView() && (value == "4" || value == "1")) {
      this.formData.patchValue({maNhaThuoc: null});
      this.formData.get('maNhaThuoc')?.disable();
    } else {
      this.formData.get('maNhaThuoc')?.enable();
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

  changeMaNhaThuoc($event: Event) {

  }
}