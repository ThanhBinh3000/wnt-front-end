import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ComponentsModule} from "../../component/base/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {NgApexchartsModule} from "ng-apexcharts";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ThuocsRoutingModule} from "./Thuocs.routing";
import {InMaVachComponent} from "./InMaVach/InMaVach.component";
import {ThuocsComponent} from "./Thuocs.component";
import {PrintAddEditDialogComponent} from "./print-add-edit-dialog/print-add-edit-dialog.component";

@NgModule({
  declarations: [
    InMaVachComponent,
    PrintAddEditDialogComponent,
    ThuocsComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    ThuocsRoutingModule,
    ComponentsModule,
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    ReactiveFormsModule,
    NgApexchartsModule,
    NzModalModule,
  ],
  exports: [],
})
export class ThuocsModule {
}
