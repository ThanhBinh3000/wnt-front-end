import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ReceiptMedicalFeeComponent } from './receipt-medical-fee.component';
import { ReceiptMedicalFeeListComponent } from './receipt-medical-fee-list/receipt-medical-fee-list.component';
import { ReceiptMedicalFeeAddEditComponent } from './receipt-medical-fee-add-edit/receipt-medical-fee-add-edit.component';
import {ReceiptMedicalFeeDetailComponent} from "./receipt-medical-fee-detail/receipt-medical-fee-detail.component";
const routes: Routes = [
  {
    path: '',
    component: ReceiptMedicalFeeComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ReceiptMedicalFeeListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'add',
        component: ReceiptMedicalFeeAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: ReceiptMedicalFeeAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'detail/:id',
        component: ReceiptMedicalFeeDetailComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptMedicalFeeRoutingModule {
}
