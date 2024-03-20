import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugUnitComponent } from './drug-unit.component';
import { RouterOutlet } from "@angular/router";
import { DrugUnitRoutingModule } from "./drug-unit.routing";
import { DrugUnitAddEditDialogComponent } from './drug-unit-add-edit-dialog/drug-unit-add-edit-dialog.component';
import { DrugUnitListComponent } from './drug-unit-location-list/drug-unit-list.component';

@NgModule({
  declarations: [
    DrugUnitComponent,
    DrugUnitListComponent,
    DrugUnitAddEditDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, DrugUnitRoutingModule],
  exports: [],
})
export class DrugUnitModule {
}
