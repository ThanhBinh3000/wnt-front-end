import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountComponent} from './account.component';
import {RouterOutlet} from "@angular/router";
import {AccountRoutingModule} from "./account-routing.module";
import {ChangePasswordDialogComponent} from "./change-password-dialog/change-password-dialog.component";
import {ChooseNhaThuocComponent} from "./choose-nha-thuoc/choose-nha-thuoc.component";
import {StaffAddEditDialogComponent} from "./staff-add-edit-dialog/staff-add-edit-dialog.component";
import {StaffListComponent} from "./staff-list/staff-list.component";
import {ComponentsModule} from "../../component/base/components.module";
import { StaffRoleDialogComponent } from './staff-role-dialog/staff-role-dialog.component';
import {AccountAddEditDialogComponent} from "./account-add-edit-dialog/account-add-edit-dialog.component";
import {AccountListComponent} from "./account-list/account-list.component";
import {
  AccountResetPasswordDialogComponent
} from "./account-reset-password-dialog/account-reset-password-dialog.component";
import {AccountPickerListDialogComponent} from "./account-picker-list-dialog/account-picker-list-dialog.component";
import {RoleAddEditDialogComponent} from "./role-add-edit-dialog/role-add-edit-dialog.component";
import {PrivilegeViewDialogComponent} from "./privilege-view-dialog/privilege-add-edit-dialog.component";
import {MatList, MatListItem} from "@angular/material/list";
import {StaffRoleAddEditDialogComponent} from "./staff-role-add-edit-dialog/staff-role-add-edit-dialog.component";

@NgModule({
  declarations: [
    AccountComponent,
    ChangePasswordDialogComponent,
    ChooseNhaThuocComponent,
    StaffAddEditDialogComponent,
    StaffRoleDialogComponent,
    StaffListComponent,
    AccountAddEditDialogComponent,
    AccountListComponent,
    AccountResetPasswordDialogComponent,
    AccountPickerListDialogComponent,
    RoleAddEditDialogComponent,
    PrivilegeViewDialogComponent,
    StaffRoleAddEditDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, AccountRoutingModule, ComponentsModule, MatList, MatListItem],
  exports: [
    ChangePasswordDialogComponent
  ],
})
export class AccountModule {
}
