import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InOutNoteComponent} from './in-out-note.component';
import {RouterOutlet} from "@angular/router";
import {InOutNoteRoutingModule} from "./in-out-note.routing";
import {InOutNoteListComponent} from './in-out-note-list/in-out-note-list.component';
import {
  OtherInOutNoteAddEditDialogComponent
} from './other-in-out-note-add-edit-dialog/other-in-out-note-add-edit-dialog.component';
import {ComponentsModule} from '../../component/base/components.module';
import {
  OtherInOutNoteDetailDialogComponent
} from "./other-in-out-note-detail-dialog/other-in-out-note-detail-dialog.component";
import {
  InComingCustomerNoteDetailDialogComponent
} from "./in-coming-customer-note-detail-dialog/in-coming-customer-note-detail-dialog.component";
import {
  OutReturnCustomerNoteDetailDialogComponent
} from "./out-return-customer-note-detail-dialog/out-return-customer-note-detail-dialog.component";
import {
  OutComingSupplierNoteDetailDialogComponent
} from "./out-coming-supplier-note-detail-dialog/out-coming-supplier-note-detail-dialog.component";
import {
  InReturnSupplierNoteDetailDialogComponent
} from "./in-return-supplier-note-detail-dialog/in-return-supplier-note-detail-dialog.component";
import {
  InComingCustomerNoteAddEditDialogComponent
} from "./in-coming-customer-note-add-edit-dialog/in-coming-customer-note-add-edit-dialog.component";
import {
  OutReturnCustomerNoteAddEditDialogComponent
} from "./out-return-customer-note-add-edit-dialog/out-return-customer-note-add-edit-dialog.component";
import {
  OutComingSupplierNoteAddEditDialogComponent
} from "./out-coming-supplier-note-add-edit-dialog/out-coming-supplier-note-add-edit-dialog.component";
import {
  InReturnSupplierNoteAddEditDialogComponent
} from "./in-return-supplier-note-add-edit-dialog/in-return-supplier-note-add-edit-dialog.component";

@NgModule({
  declarations: [
    InOutNoteComponent,
    InOutNoteListComponent,
    OtherInOutNoteAddEditDialogComponent,
    OtherInOutNoteDetailDialogComponent,
    InComingCustomerNoteAddEditDialogComponent,
    InComingCustomerNoteDetailDialogComponent,
    OutReturnCustomerNoteAddEditDialogComponent,
    OutReturnCustomerNoteDetailDialogComponent,
    OutComingSupplierNoteAddEditDialogComponent,
    OutComingSupplierNoteDetailDialogComponent,
    InReturnSupplierNoteAddEditDialogComponent,
    InReturnSupplierNoteDetailDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, InOutNoteRoutingModule, ComponentsModule],
  exports: [],
})
export class InOutNoteModule {
}
