import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ReceiptMedicalFeeRoutingModule} from "./receipt-medical-fee.routing";

import { ReceiptMedicalFeeComponent } from './receipt-medical-fee.component';
import { ReceiptMedicalFeeListComponent } from './receipt-medical-fee-list/receipt-medical-fee-list.component';
import { ReceiptMedicalFeeAddEditComponent } from './receipt-medical-fee-add-edit/receipt-medical-fee-add-edit.component';
import {ReceiptMedicalFeeDetailComponent} from "./receipt-medical-fee-detail/receipt-medical-fee-detail.component";
import {ComponentsModule} from "../../component/base/components.module";


@NgModule({
  declarations: [
    ReceiptMedicalFeeComponent,
    ReceiptMedicalFeeListComponent,
    ReceiptMedicalFeeAddEditComponent,
    ReceiptMedicalFeeDetailComponent
  ],
  imports: [CommonModule, RouterOutlet, ReceiptMedicalFeeRoutingModule, ComponentsModule],
  exports: [],
})
export class ReceiptMedicalFeeModule {
}
