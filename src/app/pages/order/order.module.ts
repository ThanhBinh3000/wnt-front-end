import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrderComponent} from './order.component';
import {RouterOutlet} from "@angular/router";
import { OrderRoutingModule } from './order.routing';
import { SearchDrugComponent } from './search-drug/search-drug.component';
import { FormQuickComponent } from './pick-up-order/form-quick/form-quick.component';
import { HandleOrderComponent } from './pick-up-order/handle-order/handle-order.component';
import { PickUpOrderDetailComponent } from './pick-up-order/pick-up-order-detail/pick-up-order-detail.component';
import { ListOrderPickUpComponent } from './pick-up-order/list-order-pick-up/list-order-pick-up.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {NgOptionHighlightModule} from "@ng-select/ng-option-highlight";
import {FormsModule} from "@angular/forms";
import {ListOrderAssignComponent} from "./list-order-assign/list-order-assign.component";
import {ComponentsModule} from "../../component/base/components.module";
import {ListDrugToBuyComponent} from "./list-drug-to-buy/list-drug-to-buy.component";
@NgModule({
  declarations: [
    OrderComponent,
    SearchDrugComponent,
    FormQuickComponent,
    HandleOrderComponent,
    PickUpOrderDetailComponent,
    ListOrderPickUpComponent,
    CreateOrderComponent,
    OrderListComponent,
    ListOrderAssignComponent,
    ListDrugToBuyComponent
  ],
  imports: [CommonModule, RouterOutlet, OrderRoutingModule, NgSelectModule, MatTable, MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, NgOptionHighlightModule, FormsModule, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, ComponentsModule],
  exports: [],
})
export class OrderModule {
}
