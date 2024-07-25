import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteManagementComponent } from './note-management.component';
import { RouterOutlet } from "@angular/router";
import { NoteManagementRoutingModule } from "./note-management.routing";
import { NoteListComponent } from './note-list/note-list.component';
import { CancelDeliveryNoteScreenComponent } from './cancel-delivery-note/cancel-delivery-note-screen/cancel-delivery-note-screen.component';
import { CancelDeliveryNoteDetailComponent } from './cancel-delivery-note/cancel-delivery-note-detail/cancel-delivery-note-detail.component';
import { DeliveryNoteScreenComponent } from './delivery-note/delivery-note-screen/delivery-note-screen.component';
import { DeliveryNoteDetailComponent } from './delivery-note/delivery-note-detail/delivery-note-detail.component';
import { DeliveryNoteBarcodeScreenComponent } from './delivery-note/delivery-note-barcode-screen/delivery-note-barcode-screen.component';
import { DeliveryNoteESScreenComponent } from './delivery-note/delivery-note-es-screen/delivery-note-es-screen.component';
import { ReceiptNoteScreenComponent } from './receipt-note/receipt-note-screen/receipt-note-screen.component';
import { ReceiptNoteDetailComponent } from './receipt-note/receipt-note-detail/receipt-note-detail.component';
import { ReturnFromCustomerNoteScreenComponent } from './return-from-customer-note/return-from-customer-note-screen/return-from-customer-note-screen.component';
import { ReturnFromCustomerNoteDetailComponent } from './return-from-customer-note/return-from-customer-note-detail/return-from-customer-note-detail.component';
import { ReturnToSupplierNoteScreenComponent } from './return-to-supplier-note/return-to-supplier-note-screen/return-to-supplier-note-screen.component';
import { ReturnToSupplierNoteDetailComponent } from './return-to-supplier-note/return-to-supplier-note-detail/return-to-supplier-note-detail.component';
import { WarehouseTransferNoteScreenComponent } from './warehouse-transfer-note/warehouse-transfer-note-screen/warehouse-transfer-note-screen.component';
import { WarehouseTransferNoteDetailComponent } from './warehouse-transfer-note/warehouse-transfer-note-detail/warehouse-transfer-note-detail.component';
import { DrugModule } from '../drug/drug.module';
import { SupplierModule } from '../supplier/supplier.module';
import { InventoryModule } from '../inventory/inventory.module';
import { TransactionModule } from '../transaction/transaction.module';
import {ComponentsModule} from "../../component/base/components.module";
import {ReceiptNoteTableComponent} from "./note-list/receipt-note-table/receipt-note-table.component";
import {DeliveryNoteTableComponent} from "./note-list/delivery-note-table/delivery-note-table.component";
import {
  CancelDeliveryNoteTableComponent
} from "./note-list/cancel-delivery-note-table/cancel-delivery-note-table.component";
import {InventoryNoteTableComponent} from "./note-list/inventory-note-table/inventory-note-table.component";
import {MedicalNoteTableComponent} from "./note-list/medical-note-table/medical-note-table.component";
import {
  ReceiptMedicalFeeNoteTableComponent
} from "./note-list/receipt-medical-fee-note-table/receipt-medical-fee-note-table.component";
import {ReserveNoteTableComponent} from "./note-list/reserve-note-table/reserve-note-table.component";
import {
  ReturnFromCustomerNoteTableComponent
} from "./note-list/return-from-customer-note-table/return-from-customer-note-table.component";
import {
  ReturnToSupplierNoteTableComponent
} from "./note-list/return-to-supplier-note-table/return-to-supplier-note-table.component";
import {ServiceNoteTableComponent} from "./note-list/service-note-table/service-note-table.component";
import {WaitNoteTableComponent} from "./note-list/wait-note-table/wait-note-table.component";
import {
  WarehouseTransferNoteTableComponent
} from "./note-list/warehouse-transfer-note-table/warehouse-transfer-note-table.component";
import {TooltipDirective} from "./delivery-note/delivery-note-screen/tooltip/tooltip.directive";

@NgModule({
  declarations: [
    NoteManagementComponent,
    NoteListComponent,
    DeliveryNoteScreenComponent,
    DeliveryNoteBarcodeScreenComponent,
    DeliveryNoteESScreenComponent,
    DeliveryNoteDetailComponent,
    ReceiptNoteScreenComponent,
    ReceiptNoteDetailComponent,
    ReturnFromCustomerNoteScreenComponent,
    ReturnFromCustomerNoteDetailComponent,
    ReturnToSupplierNoteScreenComponent,
    ReturnToSupplierNoteDetailComponent,
    CancelDeliveryNoteScreenComponent,
    CancelDeliveryNoteDetailComponent,
    WarehouseTransferNoteScreenComponent,
    WarehouseTransferNoteDetailComponent,
    ReceiptNoteTableComponent,
    DeliveryNoteTableComponent,
    CancelDeliveryNoteTableComponent,
    InventoryNoteTableComponent,
    MedicalNoteTableComponent,
    ReceiptMedicalFeeNoteTableComponent,
    ReserveNoteTableComponent,
    ReturnFromCustomerNoteTableComponent,
    ReturnToSupplierNoteTableComponent,
    ServiceNoteTableComponent,
    WaitNoteTableComponent,
    WarehouseTransferNoteTableComponent,
    TooltipDirective
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterOutlet,
    NoteManagementRoutingModule,
    DrugModule,
    SupplierModule,
    InventoryModule,
    TransactionModule
  ],
  exports: [
  ],
})
export class NoteManagementModule {
}
