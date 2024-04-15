import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SystemComponent} from './system.component';
import {RouterOutlet} from "@angular/router";
import {SystemRoutingModule} from "./system.routing";
import {AccountManagerComponent} from './admin/account-manager/account-manager.component';
import {AccountAddEditDialogComponent} from './admin/account-add-edit-dialog/account-add-edit-dialog.component';
import {
  AccountResetPasswordDialogComponent
} from './admin/account-reset-password-dialog/account-reset-password-dialog.component';
import {
  ConfirmPaymentSendZnsDialogComponent
} from './drug-store/confirm-payment-send-zns-dialog/confirm-payment-send-zns-dialog.component';
import {DrugStoreListComponent} from './drug-store/drug-store-list/drug-store-list.component';
import {
  GeneralStoreMappingDialogComponent
} from './drug-store/general-store-mapping-dialog/general-store-mapping-dialog.component';
import {
  CriteriaBusinessDialogComponent
} from './drug-store/criteria-business-dialog/criteria-business-dialog.component';
import {DrugStoreInformationComponent} from './drug-store/drug-store-information/drug-store-information.component';
import {ComponentsModule} from "../../component/base/components.module";
import {
  DrugStoreAddEditDialogComponent
} from "./drug-store/drug-store-add-edit-dialog/drug-store-add-edit-dialog.component";
import {BankAccountListDialogComponent} from "./drug-store/bank-account-list-dialog/bank-account-list-dialog.component";
import {
  BankAccountAddEditDialogComponent
} from "./drug-store/bank-account-add-edit-dialog/bank-account-add-edit-dialog.component";
import {UserPickerListDialogComponent} from "./drug-store/user-picker-list-dialog/user-picker-list-dialog.component";
import {
  DrugStorePickerListDialogComponent
} from "./drug-store/drug-store-picker-list-dialog/drug-store-picker-list-dialog.component";

@NgModule({
  declarations: [
    SystemComponent,
    AccountManagerComponent,
    DrugStoreListComponent,
    DrugStoreInformationComponent,
    AccountAddEditDialogComponent,
    AccountResetPasswordDialogComponent,
    ConfirmPaymentSendZnsDialogComponent,
    GeneralStoreMappingDialogComponent,
    CriteriaBusinessDialogComponent,
    DrugStoreAddEditDialogComponent,
    BankAccountListDialogComponent,
    BankAccountAddEditDialogComponent,
    UserPickerListDialogComponent,
    DrugStorePickerListDialogComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    SystemRoutingModule,
    ComponentsModule,
    NgOptimizedImage,
  ],
  exports: [
    AccountAddEditDialogComponent,
    AccountResetPasswordDialogComponent,
    ConfirmPaymentSendZnsDialogComponent,
    GeneralStoreMappingDialogComponent,
    CriteriaBusinessDialogComponent,
    DrugStoreAddEditDialogComponent,
    BankAccountListDialogComponent,
    BankAccountAddEditDialogComponent,
    UserPickerListDialogComponent,
    DrugStorePickerListDialogComponent
  ],
})
export class SystemModule {
}
