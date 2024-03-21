import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DoctorGroupComponent} from './doctor-group.component';
import {RouterOutlet} from "@angular/router";
import {DoctorGroupRoutingModule} from "./doctor-group.routing";
import { DoctorGroupAddEditDialogComponent } from './doctor-group-add-edit-dialog/doctor-group-add-edit-dialog.component';
import { DoctorGroupListComponent } from './doctor-group-list/doctor-group-list.component';

@NgModule({
  declarations: [
    DoctorGroupComponent,
    DoctorGroupListComponent,
    DoctorGroupAddEditDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, DoctorGroupRoutingModule],
  exports: [],
})
export class DoctorGroupModule {
}
