import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SystemComponent} from './system.component';
import {RouterOutlet} from "@angular/router";
import {SystemRoutingModule} from "./system.routing";
import { AccountManagerComponent } from './admin/account-manager/account-manager.component';
import { AccountAddEditDialogComponent } from './admin/account-add-edit-dialog/account-add-edit-dialog.component';
import { AccountResetPasswordDialogComponent } from './admin/account-reset-password-dialog/account-reset-password-dialog.component';
import { ConfirmPaymentZnsDialogComponent } from './drug-store/drug-store-listing/confirm-payment-zns-dialog/confirm-payment-zns-dialog.component';
@NgModule({
  declarations: [
    SystemComponent,
    AccountManagerComponent,
    AccountAddEditDialogComponent,
    AccountResetPasswordDialogComponent,
    ConfirmPaymentZnsDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, SystemRoutingModule],
  exports: [],
})
export class SystemModule {
}
