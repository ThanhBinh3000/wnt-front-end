import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountComponent} from './account.component';
import {RouterOutlet} from "@angular/router";
import {AccountRoutingModule} from "./account-routing.module";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChooseNhaThuocComponent} from "./choose-nha-thuoc/choose-nha-thuoc.component";
import {ChangeStaffComponent} from "./change-staff/change-staff.component";
import {StaffPermissionComponent} from "./staff-permission/staff-permission.component";
import {StaffListComponent} from "./staff-list/staff-list.component";
import {ComponentsModule} from "../../component/base/components.module";

@NgModule({
  declarations: [
    AccountComponent,
    ChangePasswordComponent,
    ChooseNhaThuocComponent,
    ChangeStaffComponent,
    StaffPermissionComponent,
    StaffListComponent,
  ],
  imports: [CommonModule, RouterOutlet, AccountRoutingModule, ComponentsModule],
  exports: [],
})
export class AccountModule {
}
