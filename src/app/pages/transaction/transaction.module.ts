import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { RouterOutlet } from "@angular/router";
import { TransactionRoutingModule } from "./transaction.routing";
import { TransactionDetailByObjectDialogComponent } from './transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';


@NgModule({
  declarations: [
    TransactionComponent,
    TransactionDetailByObjectDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, TransactionRoutingModule],
  exports: [
    TransactionDetailByObjectDialogComponent
  ],
})
export class TransactionModule {
}
