import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {DrugStoreComponent} from './drug-store.component';
import {RouterOutlet} from "@angular/router";
import {DrugStoreRoutingModule} from "./drug-store.routing";
import {ComponentsModule} from "../../component/base/components.module";
import {
  DrugStoreGeneralMappingDialogComponent
} from "./drug-store-general-mapping-dialog/drug-store-general-mapping-dialog.component";
import {DrugStoreAddEditDialogComponent} from "./drug-store-add-edit-dialog/drug-store-add-edit-dialog.component";
import {
  DrugStorePickerListDialogComponent
} from "./drug-store-picker-list-dialog/drug-store-picker-list-dialog.component";
import {DrugStoreListComponent} from "./drug-store-list/drug-store-list.component";
import {DrugStoreTrienKhaiComponent} from "./drug-store-trien-khai/drug-store-trien-khai.component";

@NgModule({
  declarations: [
    DrugStoreComponent,
    DrugStoreAddEditDialogComponent,
    DrugStoreGeneralMappingDialogComponent,
    DrugStoreListComponent,
    DrugStorePickerListDialogComponent,
    DrugStoreTrienKhaiComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    DrugStoreRoutingModule,
    ComponentsModule,
    NgOptimizedImage,
  ],
  exports: [
  ],
})
export class DrugStoreModule {
}
