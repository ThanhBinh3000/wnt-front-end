import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugComponent } from './drug.component';
import { RouterOutlet } from "@angular/router";
import { DrugRoutingModule } from "./drug.routing";
import { DrugAddEditDialogComponent } from './drug-add-edit-dialog/drug-add-edit-dialog.component';
import { DrugListComponent } from './drug-list/drug-list.component';
import { DrugDetailDialogComponent } from './drug-detail-dialog/drug-detail-dialog.component';
import { DrugGroupModule } from '../drug-group/drug-group.module';
import { DrugUpdateBatchDialogComponent } from './drug-update-batch-dialog/drug-update-batch-dialog.component';
import { DrugUpdateInpriceDialogComponent } from './drug-update-inprice-dialog/drug-update-inprice-dialog.component';
import { DrugUpdateAdditionalInfoDialogComponent } from './drug-update-additional-info-dialog/drug-update-additional-info-dialog.component';
import { DrugSearchPriceInOutDialogComponent } from './drug-search-price-in-out-dialog/drug-search-price-in-out-dialog.component';
import { DrugMappingCommonDialogComponent } from './drug-mapping-common-dialog/drug-mapping-common-dialog.component';
import {ComponentsModule} from "../../component/base/components.module";

@NgModule({
  declarations: [
    DrugComponent,
    DrugListComponent,
    DrugAddEditDialogComponent,
    DrugDetailDialogComponent,
    DrugUpdateBatchDialogComponent,
    DrugUpdateInpriceDialogComponent,
    DrugUpdateAdditionalInfoDialogComponent,
    DrugSearchPriceInOutDialogComponent,
    DrugMappingCommonDialogComponent
  ],
    imports: [
      CommonModule,
      RouterOutlet,
      DrugRoutingModule,
      DrugGroupModule,
      ComponentsModule],
  exports: [
    DrugAddEditDialogComponent,
    DrugDetailDialogComponent,
    DrugUpdateBatchDialogComponent,
    DrugUpdateInpriceDialogComponent,
    DrugUpdateAdditionalInfoDialogComponent,
    DrugSearchPriceInOutDialogComponent,
    DrugMappingCommonDialogComponent
  ],
})
export class DrugModule {
}
