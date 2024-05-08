import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InOutNoteComponent} from './in-out-note.component';
import {RouterOutlet} from "@angular/router";
import {InOutNoteRoutingModule} from "./in-out-note.routing";
import { InOutNoteListComponent } from './in-out-note-list/in-out-note-list.component';
import { InOutNoteAddEditDialogComponent } from './in-out-note-add-edit-dialog/in-out-note-add-edit-dialog.component';
import { OtherInOutNoteAddEditDialogComponent } from './other-in-out-note-add-edit-dialog/other-in-out-note-add-edit-dialog.component';
import { ComponentsModule } from '../../component/base/components.module';
import {
  OtherInOutNoteDetailDialogComponent
} from "./other-in-out-note-detail-dialog/other-in-out-note-detail-dialog.component";
import {InOutNoteDetailDialogComponent} from "./in-out-note-detail-dialog/in-out-note-detail-dialog.component";

@NgModule({
  declarations: [
    InOutNoteComponent,
    InOutNoteListComponent,
    InOutNoteAddEditDialogComponent,
    OtherInOutNoteAddEditDialogComponent,
    InOutNoteDetailDialogComponent,
    OtherInOutNoteDetailDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, InOutNoteRoutingModule, ComponentsModule],
  exports: [],
})
export class InOutNoteModule {
}
