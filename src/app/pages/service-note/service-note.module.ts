import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ServiceNoteRoutingModule} from "./service-note.routing";

import { CustomerModule } from '../customer/customer.module';
import { ServiceNoteComponent } from './service-note.component';
import { ServiceNoteListComponent } from './service-note-list/service-note-list.component';
import { ServiceNoteAddEditComponent } from './service-note-add-edit/service-note-add-edit.component';
import {ServiceNoteDetailComponent} from "./service-note-detail/service-note-detail.component";
import {ComponentsModule} from "../../component/base/components.module";
import {FormsModule} from "@angular/forms";
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
import {ServiceNoteWaitListComponent} from "./service-note-wait-list/service-note-wait-list.component";
import { ListedServiceDialogComponent } from './listed-service-dialog/listed-service-dialog.component';


@NgModule({
  declarations: [
    ServiceNoteComponent,
    ServiceNoteListComponent,
    ServiceNoteWaitListComponent,
    ServiceNoteAddEditComponent,
    ServiceNoteDetailComponent,
    ListedServiceDialogComponent,
  ],
    imports: [CommonModule, RouterOutlet, ServiceNoteRoutingModule, ComponentsModule, FormsModule, MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatSort, MatSortHeader, MatTable],
  exports: [ListedServiceDialogComponent],
})
export class ServiceNoteModule {
}
