import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SystemComponent} from './system.component';
import {RouterOutlet} from "@angular/router";
import {SystemRoutingModule} from "./system.routing";
import { AccountManagerComponent } from './admin/account-manager/account-manager.component';
import { AccountAddEditDialogComponent } from './admin/account-add-edit-dialog/account-add-edit-dialog.component';
import { AccountResetPasswordDialogComponent } from './admin/account-reset-password-dialog/account-reset-password-dialog.component';
import {ConfirmPaymentSendZnsDialogComponent } from './drug-store/confirm-payment-send-zns-dialog/confirm-payment-send-zns-dialog.component';
import { DrugStoreListingComponent } from './drug-store/drug-store-listing/drug-store-listing.component';
import { GeneralStoreMappingDialogComponent } from './drug-store/general-store-mapping-dialog/general-store-mapping-dialog.component';
import { CriteriaBusinessDialogComponent } from './drug-store/criteria-business-dialog/criteria-business-dialog.component';
import { DrugStoreInformationComponent } from './drug-store/drug-store-information/drug-store-information.component';
import {ComponentsModule} from "../../component/base/components.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgOptionHighlightModule} from "@ng-select/ng-option-highlight";
@NgModule({
  declarations: [
    SystemComponent,
    AccountManagerComponent,
    AccountAddEditDialogComponent,
    AccountResetPasswordDialogComponent,
    DrugStoreListingComponent,
    ConfirmPaymentSendZnsDialogComponent,
    GeneralStoreMappingDialogComponent,
    CriteriaBusinessDialogComponent,
    DrugStoreInformationComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    SystemRoutingModule,
    ComponentsModule,
    NgSelectModule,
    NgOptionHighlightModule,
  ],
  exports: [],
})
export class SystemModule {
}
