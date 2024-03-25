import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {MedicalNoteRoutingModule} from "./medical-note.routing";

import { CustomerModule } from '../customer/customer.module';
import { MedicalNoteComponent } from './medical-note.component';
import { MedicalNoteListComponent } from './medical-note-list/medical-note-list.component';
import { MedicalNoteAddEditComponent } from './medical-note-add-edit/medical-note-add-edit.component';


@NgModule({
  declarations: [
    MedicalNoteComponent,
    MedicalNoteListComponent,
    MedicalNoteAddEditComponent
  ],
  imports: [CommonModule, RouterOutlet, MedicalNoteRoutingModule, CustomerModule],
  exports: [],
})
export class MedicalNoteModule {
}
