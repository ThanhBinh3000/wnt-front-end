import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ReceiptMedicalFeeRoutingModule} from "./receipt-medical-fee.routing";

import { ReceiptMedicalFeeComponent } from './receipt-medical-fee.component';
import { ReceiptMedicalFeeListComponent } from './receipt-medical-fee-list/receipt-medical-fee-list.component';
import { ReceiptMedicalFeeAddEditComponent } from './receipt-medical-fee-add-edit/receipt-medical-fee-add-edit.component';


@NgModule({
  declarations: [
    ReceiptMedicalFeeComponent,
    ReceiptMedicalFeeListComponent,
    ReceiptMedicalFeeAddEditComponent
  ],
  imports: [CommonModule, RouterOutlet, ReceiptMedicalFeeRoutingModule],
  exports: [],
})
export class ReceiptMedicalFeeModule {
}
