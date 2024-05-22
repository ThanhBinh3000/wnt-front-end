import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReserveComponent} from './reserve.component';
import {RouterOutlet} from "@angular/router";
import {ReserveRoutingModule} from './reserve.routing';
import { NoteReserveAddEditComponent } from './note-reserve-add-edit/note-reserve-add-edit.component';
import { NoteReserveDetailComponent } from './note-reserve-detail/note-reserve-detail.component';
import { NoteReserveDeleteComponent } from './note-reserve-delete/note-reserve-delete.component';
import { ComponentsModule } from '../../component/base/components.module';
@NgModule({
  declarations: [
    ReserveComponent,
    NoteReserveAddEditComponent,
    NoteReserveDetailComponent,
    NoteReserveDeleteComponent
  ],
  imports: [CommonModule, RouterOutlet, ReserveRoutingModule, ComponentsModule],
  exports: [],
})
export class ReserveModule {
}
