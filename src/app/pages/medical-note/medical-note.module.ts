import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {MedicalNoteRoutingModule} from "./medical-note.routing";
import { MedicalNoteComponent } from './medical-note.component';
import { MedicalNoteHistoryListComponent } from './medical-note-history-list/medical-note-history-list.component';
import { MedicalNoteAddEditComponent } from './medical-note-add-edit/medical-note-add-edit.component';
import {MedicalNoteListComponent} from "./medical-note-list/medical-note-list.component";
import {
  MedicalNoteWaitAddEditDialogComponent
} from "./medical-note-wait-add-edit-dialog/medical-note-wait-add-edit-dialog.component";
import {ComponentsModule} from "../../component/base/components.module";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  MedicalNoteHistoryTableComponent
} from "./medical-note-history-list/medical-note-history-table/medical-note-history-table.component";
import {
  ServiceNoteHistoryTableComponent
} from "./medical-note-history-list/service-note-history-table/service-note-history-table.component";
import { PaymentMediCalNoteDialogComponent } from './payment-medical-note-dialog/payment-medical-note-dialog.component';


@NgModule({
  declarations: [
    MedicalNoteComponent,
    MedicalNoteListComponent,
    MedicalNoteHistoryTableComponent,
    ServiceNoteHistoryTableComponent,
    MedicalNoteHistoryListComponent,
    MedicalNoteAddEditComponent,
    MedicalNoteWaitAddEditDialogComponent,
    PaymentMediCalNoteDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, MedicalNoteRoutingModule, ComponentsModule, MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatSort, MatSortHeader, MatTable],
  exports: [],
})
export class MedicalNoteModule {
}
