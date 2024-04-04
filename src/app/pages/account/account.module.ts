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
import { StaffPermissionDialogComponent } from './staff-permission-dialog/staff-permission-dialog.component';

@NgModule({
  declarations: [
    AccountComponent,
    ChangePasswordDialogComponent,
    ChooseNhaThuocComponent,
    StaffAddEditDialogComponent,
    StaffPermissionDialogComponent,
    StaffListComponent,
  ],
  imports: [CommonModule, RouterOutlet, AccountRoutingModule, ComponentsModule],
  exports: [
    ChangePasswordDialogComponent
  ],
})
export class AccountModule {
}
