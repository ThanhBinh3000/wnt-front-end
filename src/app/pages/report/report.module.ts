import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterOutlet} from "@angular/router";
import {ReportRoutingModule} from './report.routing';
import { ReportComponent } from './report.component';
import { DrugTransactionHistoryComponent } from './drug-transaction-history/drug-transaction-history.component';
import { TransactionHistoryDeliveryItemTablePartialComponent } from './transaction-history-delivery-item-table-partial/transaction-history-delivery-item-table-partial.component';
import { TransactionHistoryReceiptItemTablePartialComponent } from './transaction-history-receipt-item-table-partial/transaction-history-receipt-item-table-partial.component';
@NgModule({
  declarations: [
    ReportComponent,
    DrugTransactionHistoryComponent,
    TransactionHistoryDeliveryItemTablePartialComponent,
    TransactionHistoryReceiptItemTablePartialComponent
  ],
  imports: [CommonModule, RouterOutlet, ReportRoutingModule],
  exports: [],
})
export class ReportModule {
}
