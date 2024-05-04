import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './customer.component';
import {RouterOutlet} from "@angular/router";
import {CustomerRoutingModule} from "./customer.routing";
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerAddEditDialogComponent } from './customer-add-edit-dialog/customer-add-edit-dialog.component';
import { CustomerPrintBarcodeDialogComponent } from './customer-print-barcode-dialog/customer-print-barcode-dialog.component';
import { ComponentsModule } from '../../component/base/components.module';
import { CustomerDetailDialogComponent } from './customer-detail-dialog/customer-detail-dialog.component';
@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerAddEditDialogComponent,
    CustomerPrintBarcodeDialogComponent,
    CustomerDetailDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, CustomerRoutingModule, ComponentsModule],
  exports: [
    CustomerAddEditDialogComponent,
    CustomerPrintBarcodeDialogComponent,
    CustomerDetailDialogComponent
  ],
})
export class CustomerModule {
}
