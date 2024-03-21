import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugComponent } from './drug.component';
import { RouterOutlet } from "@angular/router";
import { DrugRoutingModule } from "./drug.routing";
import { DrugAddEditDialogComponent } from './drug-add-edit-dialog/drug-add-edit-dialog.component';
import { DrugListComponent } from './drug-list/drug-list.component';
import { DrugDetailDialogComponent } from './drug-detail-dialog/drug-detail-dialog.component';
import { DrugGroupModule } from '../drug-group/drug-group.module';

@NgModule({
  declarations: [
    DrugComponent,
    DrugListComponent,
    DrugAddEditDialogComponent,
    DrugDetailDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, DrugRoutingModule, DrugGroupModule],
  exports: [
    DrugAddEditDialogComponent,
    DrugDetailDialogComponent
  ],
})
export class DrugModule {
}
