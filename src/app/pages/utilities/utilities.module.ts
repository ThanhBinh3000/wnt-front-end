import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import { UtilitiesRoutingModule } from './utilities.routing';
import { RegionInformationEditDialogComponent } from './region-information-edit-dialog/region-information-edit-dialog.component';
import { ComponentsModule } from '../../component/base/components.module';
import { UtilitiesComponent } from './utilities.component';
import {
  BankAccountAddEditDialogComponent
} from "./bank-account/bank-account-add-edit-dialog/bank-account-add-edit-dialog.component";
import {
  BankAccountListDialogComponent
} from "./bank-account/bank-account-list-dialog/bank-account-list-dialog.component";
import {
  ConfirmPaymentSendZnsDialogComponent
} from "./zalo/confirm-payment-send-zns-dialog/confirm-payment-send-zns-dialog.component";
import {OperatingTargetComponent} from "./OperatingTarget/OperatingTarget.component";
import { TinhLieuDialogComponent } from './tinh-lieu-dialog/tinh-lieu-dialog.component';

@NgModule({
  declarations: [
    UtilitiesComponent,
    RegionInformationEditDialogComponent,
    BankAccountAddEditDialogComponent,
    BankAccountListDialogComponent,
    ConfirmPaymentSendZnsDialogComponent,
    OperatingTargetComponent,
    TinhLieuDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, UtilitiesRoutingModule, ComponentsModule],
  exports: [TinhLieuDialogComponent],
})
export class UtilitiesModule {
}
