import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ReportRoutingModule} from './report.routing';
import {ReportComponent} from './report.component';
import {DrugTransactionHistoryComponent} from './drug-transaction-history/drug-transaction-history.component';
import {
  TransactionHistoryDeliveryItemTablePartialComponent
} from './transaction-history-delivery-item-table-partial/transaction-history-delivery-item-table-partial.component';
import {
  TransactionHistoryReceiptItemTablePartialComponent
} from './transaction-history-receipt-item-table-partial/transaction-history-receipt-item-table-partial.component';
import {RevenueDetailsByDayComponent} from "./RevenueDetailsByDay/RevenueDetailsByDay.component";
import {ComponentsModule} from "../../component/base/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {InOutCommingDetailsByDayComponent} from "./InOutCommingDetailsByDay/InOutCommingDetailsByDay.component";

@NgModule({
  declarations: [
    ReportComponent,
    DrugTransactionHistoryComponent,
    TransactionHistoryDeliveryItemTablePartialComponent,
    TransactionHistoryReceiptItemTablePartialComponent,
    RevenueDetailsByDayComponent,
    InOutCommingDetailsByDayComponent,
  ],
  imports: [CommonModule, RouterOutlet, ReportRoutingModule, ComponentsModule, FormsModule, MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatSort, MatSortHeader, MatTable, ReactiveFormsModule],
  exports: [],
})
export class ReportModule {
}
