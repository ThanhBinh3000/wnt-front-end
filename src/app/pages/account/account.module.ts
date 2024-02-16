import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountComponent} from './account.component';
import {RouterOutlet} from "@angular/router";
import {AccountRoutingModule} from "./account-routing.module";
import {ChangePasswordComponent} from "./change-password/change-password.component";

@NgModule({
  declarations: [
    AccountComponent,
    ChangePasswordComponent
  ],
  imports: [CommonModule, RouterOutlet, AccountRoutingModule],
  exports: [],
})
export class AccountModule {
}
