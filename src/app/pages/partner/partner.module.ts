import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartnerComponent} from './partner.component';
import {RouterOutlet} from "@angular/router";
import {PartnerRoutingModule} from "./partner.routing";
import { CustomerGroupListComponent } from './customer-group/customer-group-list/customer-group-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerGroupAddEditDialogComponent } from './customer-group/customer-group-add-edit-dialog/customer-group-add-edit-dialog.component';
import { CustomerAddEditDialogComponent } from './customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { DoctorGroupAddEditDialogComponent } from './doctor-group/doctor-group-add-edit-dialog/doctor-group-add-edit-dialog.component';
import { DoctorGroupListComponent } from './doctor-group/doctor-group-list/doctor-group-list.component';
import { DoctorAddEditDialogComponent } from './doctor/doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { DoctorListComponent } from './doctor/doctor-list/doctor-list.component';
import { SupplierGroupAddEditDialogComponent } from './supplier-group/supplier-group-add-edit-dialog/supplier-group-add-edit-dialog.component';
import { SupplierGroupListComponent } from './supplier-group/supplier-group-list/supplier-group-list.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { SupplierAddEditDialogComponent } from './supplier/supplier-add-edit-dialog/supplier-add-edit-dialog.component';
import { SupplierRewardProgramComponent } from './supplier/supplier-reward-program-dialog/supplier-reward-program-dialog.component';
import { CustomerPrintBarcodeDialogComponent } from './customer/customer-print-barcode-dialog/customer-print-barcode-dialog.component';

@NgModule({
  declarations: [
    PartnerComponent,
    CustomerGroupListComponent,
    CustomerGroupAddEditDialogComponent,
    CustomerListComponent,
    CustomerAddEditDialogComponent,
    CustomerPrintBarcodeDialogComponent,
    DoctorGroupListComponent,
    DoctorGroupAddEditDialogComponent,
    DoctorListComponent,
    DoctorAddEditDialogComponent,
    SupplierGroupListComponent,
    SupplierGroupAddEditDialogComponent,
    SupplierListComponent,
    SupplierAddEditDialogComponent,
    SupplierRewardProgramComponent
  ],
  imports: [CommonModule, RouterOutlet, PartnerRoutingModule],
  exports: [],
})
export class PartnerModule {
}
