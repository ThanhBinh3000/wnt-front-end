import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './customer.component';
import {RouterOutlet} from "@angular/router";
import {CustomerRoutingModule} from "./customer.routing";
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerAddEditDialogComponent } from './customer-add-edit-dialog/customer-add-edit-dialog.component';
import { CustomerPrintBarcodeDialogComponent } from './customer-print-barcode-dialog/customer-print-barcode-dialog.component';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerAddEditDialogComponent,
    CustomerPrintBarcodeDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, CustomerRoutingModule],
  exports: [],
})
export class CustomerModule {
}
