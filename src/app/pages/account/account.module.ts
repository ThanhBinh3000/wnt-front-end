import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountComponent} from './account.component';
import {RouterOutlet} from "@angular/router";
import {AccountRoutingModule} from "./account-routing.module";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChooseDepartmentComponent} from "./choose-department/choose-department.component";

@NgModule({
  declarations: [
    AccountComponent,
    ChangePasswordComponent,
    ChooseDepartmentComponent
  ],
  imports: [CommonModule, RouterOutlet, AccountRoutingModule],
  exports: [],
})
export class AccountModule {
}
