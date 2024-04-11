import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WaitNoteComponent} from './wait-note.component';
import {RouterOutlet} from "@angular/router";
import {WaitNoteRoutingModule} from "./wait-note.routing";
import { WaitNoteListComponent } from './wait-note-list/wait-note-list.component';
import { WaitNoteAddEditDialogComponent } from './wait-note-add-edit-dialog/wait-note-add-edit-dialog.component';


@NgModule({
  declarations: [
    WaitNoteComponent,
    WaitNoteListComponent,
    WaitNoteAddEditDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, WaitNoteRoutingModule],
  exports: [],
})
export class WaitNoteModule {
}
