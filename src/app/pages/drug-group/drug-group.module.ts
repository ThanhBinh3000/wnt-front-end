import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugGroupComponent } from './drug-group.component';
import { RouterOutlet } from "@angular/router";
import { DrugGroupRoutingModule } from "./drug-group.routing";
import { DrugGroupAddEditDialogComponent } from './drug-group-add-edit-dialog/drug-group-add-edit-dialog.component';
import { DrugGroupListComponent } from './drug-group-list/drug-group-list.component';

@NgModule({
  declarations: [
    DrugGroupComponent,
    DrugGroupListComponent,
    DrugGroupAddEditDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, DrugGroupRoutingModule],
  exports: [
    DrugGroupAddEditDialogComponent
  ],
})
export class DrugGroupModule {
}
