import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { NoteManagementComponent } from './note-management.component';
import { NoteListComponent } from './note-list/note-list.component';
import { DeletedNoteListComponent } from './deleted-note-list/deleted-note-list.component';
import { CancelDeliveryNoteScreenComponent } from './cancel-delivery-note/cancel-delivery-note-screen/cancel-delivery-note-screen.component';
import { DeliveryNoteScreenComponent } from './delivery-note/delivery-note-screen/delivery-note-screen.component';
import { DeliveryNoteBarcodeScreenComponent } from './delivery-note/delivery-note-barcode-screen/delivery-note-barcode-screen.component';
import { DeliveryNoteESScreenComponent } from './delivery-note/delivery-note-es-screen/delivery-note-es-screen.component';
import { ReceiptNoteScreenComponent } from './receipt-note/receipt-note-screen/receipt-note-screen.component';
import { WarehouseTransferNoteScreenComponent } from './warehouse-transfer-note/warehouse-transfer-note-screen/warehouse-transfer-note-screen.component';
import { ReturnFromCustomerNoteScreenComponent } from './return-from-customer-note/return-from-customer-note-screen/return-from-customer-note-screen.component';
import { ReturnToSupplierNoteScreenComponent } from './return-to-supplier-note/return-to-supplier-note-screen/return-to-supplier-note-screen.component';
import { DeliveryNoteDetailComponent } from './delivery-note/delivery-note-detail/delivery-note-detail.component';
import { ReceiptNoteDetailComponent } from './receipt-note/receipt-note-detail/receipt-note-detail.component';
import { ReturnFromCustomerNoteDetailComponent } from './return-from-customer-note/return-from-customer-note-detail/return-from-customer-note-detail.component';
import { ReturnToSupplierNoteDetailComponent } from './return-to-supplier-note/return-to-supplier-note-detail/return-to-supplier-note-detail.component';
import { WarehouseTransferNoteDetailComponent } from './warehouse-transfer-note/warehouse-transfer-note-detail/warehouse-transfer-note-detail.component';
const routes: Routes = [
  {
    path: '',
    component: NoteManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: NoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'deleted-list',
        component: DeletedNoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-detail/:id',
        component: DeliveryNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-screen',
        component: DeliveryNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-screen/:id',
        component: DeliveryNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-barcode-screen',
        component: DeliveryNoteBarcodeScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-barcode-screen/:id',
        component: DeliveryNoteBarcodeScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-es-screen',
        component: DeliveryNoteESScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'delivery-note-es-screen/:id',
        component: DeliveryNoteESScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'receipt-note-detail/:id',
        component: ReceiptNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'receipt-note-screen',
        component: ReceiptNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'receipt-note-screen/:id',
        component: ReceiptNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'return-from-customer-note-detail/:id',
        component: ReturnFromCustomerNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'return-from-customer-note-screen',
        component: ReturnFromCustomerNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'return-from-customer-note-screen/:id',
        component: ReturnFromCustomerNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'return-to-supplier-note-detail/:id',
        component: ReturnToSupplierNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'return-to-supplier-note-screen',
        component: ReturnToSupplierNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'return-to-supplier-note-screen/:id',
        component: ReturnToSupplierNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'warehouse-transfer-note-detail/:id',
        component: WarehouseTransferNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'warehouse-transfer-note-screen',
        component: WarehouseTransferNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'warehouse-transfer-note-screen/:id',
        component: WarehouseTransferNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'cancel-delivery-note-screen',
        component: CancelDeliveryNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'cancel-delivery-note-screen/:id',
        component: CancelDeliveryNoteScreenComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteManagementRoutingModule {
}
