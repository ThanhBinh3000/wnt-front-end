import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ReportRoutingModule} from './report.routing';
import {ReportComponent} from './report.component';
import {DrugTransactionHistoryComponent} from './drug-transaction-history/drug-transaction-history.component';
import {
  TransactionHistoryDeliveryItemTableComponent
} from './drug-transaction-history/transaction-history-delivery-item-table/transaction-history-delivery-item-table.component';
import {
  TransactionHistoryReceiptItemTableComponent
} from './drug-transaction-history/transaction-history-receipt-item-table/transaction-history-receipt-item-table.component';
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
import {NgApexchartsModule} from "ng-apexcharts";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ReportByCustomerComponent} from "./report-by-customer/report-by-customer.component";
import {InventoryWarehouseDataComponent} from "./InventoryWarehouseData/InventoryWarehouseData.component";

@NgModule({
  declarations: [
    ReportComponent,
    DrugTransactionHistoryComponent,
    TransactionHistoryDeliveryItemTableComponent,
    TransactionHistoryReceiptItemTableComponent,
    RevenueDetailsByDayComponent,
    InOutCommingDetailsByDayComponent,
    InventoryWarehouseDataComponent,
    ReportByCustomerComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    ReportRoutingModule,
    ComponentsModule,
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    ReactiveFormsModule,
    NgApexchartsModule,
    NzModalModule,
  ],
  exports: [],
})
export class ReportModule {
}
