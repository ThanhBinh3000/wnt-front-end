import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SampleNoteComponent} from './sample-note.component';
import {RouterOutlet} from "@angular/router";
import {SampleNoteRoutingModule} from "./sample-note.routing";
import { SampleNoteListComponent } from './sample-note-list/sample-note-list.component';
import { SampleNoteAddEditComponent } from './sample-note-add-edit/sample-note-add-edit.component';
import { CustomerModule } from '../customer/customer.module';
import { DoctorModule } from '../doctor/doctor.module';
import { ComponentsModule } from '../../component/base/components.module';
import { SampleNoteDetailComponent } from './sample-note-detail/sample-note-detail.component';
import { DrugUpdateInfoUseDialogComponent } from './drug-update-info-use-dialog/drug-update-info-use-dialog.component';
import { SampleNoteHistoryDialogComponent } from './sample-note-history-dialog/sample-note-history-dialog.component';


@NgModule({
  declarations: [
    SampleNoteComponent,
    SampleNoteListComponent,
    SampleNoteAddEditComponent,
    SampleNoteDetailComponent,
    DrugUpdateInfoUseDialogComponent,
    SampleNoteHistoryDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, SampleNoteRoutingModule, DoctorModule, ComponentsModule],
  exports: [SampleNoteHistoryDialogComponent],
})
export class SampleNoteModule {
}
