import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DoctorComponent} from './doctor.component';
import {RouterOutlet} from "@angular/router";
import {DoctorRoutingModule} from "./doctor.routing";
import { DoctorAddEditDialogComponent } from './doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { ComponentsModule } from '../../component/base/components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DoctorComponent,
    DoctorListComponent,
    DoctorAddEditDialogComponent,
  ],
  imports: [
    ComponentsModule,
    CommonModule, 
    RouterOutlet, 
    DoctorRoutingModule,
    FormsModule],
  exports: [
    DoctorAddEditDialogComponent
  ],
})
export class DoctorModule {
}
