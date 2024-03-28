import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SampleNoteComponent} from './sample-note.component';
import {RouterOutlet} from "@angular/router";
import {SampleNoteRoutingModule} from "./sample-note.routing";
import { SampleNoteListComponent } from './sample-note-list/sample-note-list.component';
import { SampleNoteAddEditComponent } from './sample-note-add-edit/sample-note-add-edit.component';
import { CustomerModule } from '../customer/customer.module';
import { DoctorModule } from '../doctor/doctor.module';


@NgModule({
  declarations: [
    SampleNoteComponent,
    SampleNoteListComponent,
    SampleNoteAddEditComponent,
  ],
  imports: [CommonModule, RouterOutlet, SampleNoteRoutingModule, CustomerModule, DoctorModule],
  exports: [],
})
export class SampleNoteModule {
}
