import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { RouterOutlet } from "@angular/router";
import { TransactionRoutingModule } from "./transaction.routing";
import { TransactionDetailByObjectDialogComponent } from './transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';
import { ComponentsModule } from '../../component/base/components.module';


@NgModule({
  declarations: [
    TransactionComponent,
    TransactionDetailByObjectDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, TransactionRoutingModule,ComponentsModule],
  exports: [
    TransactionDetailByObjectDialogComponent
  ],
})
export class TransactionModule {
}
