import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InOutNoteComponent} from './in-out-note.component';
import {RouterOutlet} from "@angular/router";
import {InOutNoteRoutingModule} from "./in-out-note.routing";
import { InOutNoteListComponent } from './in-out-note-list/in-out-note-list.component';
import { InComingNoteAddEditComponent } from './incoming-note-add-edit/incoming-note-add-edit.component';
import { OutComingNoteAddEditComponent } from './outcoming-note-add-edit/outcoming-note-add-edit.component';
import { OtherInOutNoteAddEditComponent } from './other-in-out-note-add-edit/other-in-out-note-add-edit.component';

@NgModule({
  declarations: [
    InOutNoteComponent,
    InOutNoteListComponent,
    InComingNoteAddEditComponent,
    OutComingNoteAddEditComponent,
    OtherInOutNoteAddEditComponent
  ],
  imports: [CommonModule, RouterOutlet, InOutNoteRoutingModule],
  exports: [],
})
export class InOutNoteModule {
}
