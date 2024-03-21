import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountComponent} from './account.component';
import {RouterOutlet} from "@angular/router";
import {AccountRoutingModule} from "./account-routing.module";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChooseDepartmentComponent} from "./choose-department/choose-department.component";
import {ChangeStaffComponent} from "./change-staff/change-staff.component";
import {StaffPermissionComponent} from "./staff-permission/staff-permission.component";
import {StaffListComponent} from "./staff-list/staff-list.component";

@NgModule({
  declarations: [
    AccountComponent,
    ChangePasswordComponent,
    ChooseDepartmentComponent,
    ChangeStaffComponent,
    StaffPermissionComponent,
    StaffListComponent,
  ],
  imports: [CommonModule, RouterOutlet, AccountRoutingModule],
  exports: [],
})
export class AccountModule {
}
