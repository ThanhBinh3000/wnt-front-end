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
import {DrugConnectListComponent} from "./drug-connect-list/drug-connect-list.component";
import {DrugConnectAddEditDialogComponent} from "./drug-connect-add-edit-dialog/drug-connect-add-edit-dialog.component";
import { MultipleWarehouseInventoryDialogComponent } from './multiple-warehouse-inventory-dialog/multiple-warehouse-inventory-dialog.component';
import {DrugBarCodePrintingComponent} from "./drug-bar-code-printing/drug-bar-code-printing.component";
import {
  DrugBarCodePrintingDialogComponent
} from "./drug-bar-cade-printing-dialog/drug-bar-code-printing-dialog.component";
import { DrugUpdatePriceForChildStoreDialogComponent } from './drug-update-price-for-child-store-dialog/drug-update-price-for-child-store-dialog.component';
import { DrugUpdateCommonInfosDialogComponent } from './drug-update-common-infos-dialog/drug-update-common-infos-dialog.component';

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
    DrugMappingCommonDialogComponent,
    DrugConnectListComponent,
    DrugConnectAddEditDialogComponent,
    MultipleWarehouseInventoryDialogComponent,
    DrugBarCodePrintingComponent,
    DrugBarCodePrintingDialogComponent,
    DrugUpdatePriceForChildStoreDialogComponent,
    DrugUpdateCommonInfosDialogComponent,
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
    DrugMappingCommonDialogComponent,
    MultipleWarehouseInventoryDialogComponent,
    DrugUpdatePriceForChildStoreDialogComponent,
    DrugUpdateCommonInfosDialogComponent
  ],
})
export class DrugModule {
}
