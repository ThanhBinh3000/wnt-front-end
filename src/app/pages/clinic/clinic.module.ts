import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClinicComponent} from './clinic.component';
import {RouterOutlet} from "@angular/router";
import {ClinicRoutingModule} from './clinic.routing';
import { ClinicListComponent } from './clinic-list/clinic-list.component';
import { ClinicAddEditDialogComponent } from './clinic-add-edit-dialog/clinic-add-edit-dialog.component';
@NgModule({
  declarations: [
    ClinicComponent,
    ClinicListComponent,
    ClinicAddEditDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, ClinicRoutingModule],
  exports: [],
})
export class ClinicModule {
}
