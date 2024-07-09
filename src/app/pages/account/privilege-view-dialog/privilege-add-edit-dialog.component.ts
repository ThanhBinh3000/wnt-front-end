import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {Validators} from "@angular/forms";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {PrivilegeService} from "../../../services/system/privilege.service";
import {RoleTypeService} from "../../../services/system/role-type.service";
import {RoleService} from "../../../services/system/role.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'privilege-view-dialog',
  templateUrl: './privilege-add-edit-dialog.component.html',
  styleUrl: './privilege-add-edit-dialog.component.css'
})
export class PrivilegeViewDialogComponent extends BaseComponent implements OnInit {
  privilegeList: any = [];
  privilege: any = [];
  roleTypes: any = [];
  maNhaThuocs: any = [];

  constructor(
    injector: Injector,
    public roleService: RoleService,
    private privilegeService: PrivilegeService,
    public dialogRef: MatDialogRef<PrivilegeViewDialogComponent>,
    private serviceRoleType: RoleTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, privilegeService);
    this.formData = this.fb.group({
      id: [],
      code: [{ value: undefined, disabled: true }],
      name: [{ value: undefined, disabled: true }],
      entitys:[{ value: []}],
    });
  }

  async ngOnInit() {
    if (this.data) {
      const data = await this.detail(this.data.id);
      if (data) {
        this.data = Object.assign({}, this.data, data.data);
        this.formData.patchValue(this.data);
      }
    }
    await this.searchListPrivilege();
    await this.searchListRoles();
  }

  isUpdateView() {
    return this.data?.role;
  }

  async searchListPrivilege() {
    let res = await this.privilegeService.searchList({});
    if (res?.status == STATUS_API.SUCCESS) {
      this.privilegeList = [...res.data];
      this.privilege = res.data;
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

  }

  openViewPrivilegeDialog(event: MouseEvent, item: any) {
    event.preventDefault();
    event.stopPropagation();
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
