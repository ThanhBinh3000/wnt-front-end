import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ServiceNoteRoutingModule} from "./service-note.routing";

import { CustomerModule } from '../customer/customer.module';
import { ServiceNoteComponent } from './service-note.component';
import { ServiceNoteListComponent } from './service-note-list/service-note-list.component';
import { ServiceNoteAddEditComponent } from './service-note-add-edit/service-note-add-edit.component';


@NgModule({
  declarations: [
    ServiceNoteComponent,
    ServiceNoteListComponent,
    ServiceNoteAddEditComponent
  ],
  imports: [CommonModule, RouterOutlet, ServiceNoteRoutingModule],
  exports: [],
})
export class ServiceNoteModule {
}
