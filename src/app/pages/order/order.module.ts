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
@NgModule({
  declarations: [
    OrderComponent,
    SearchDrugComponent,
    FormQuickComponent,
    HandleOrderComponent,
    PickUpOrderDetailComponent,
    ListOrderPickUpComponent
  ],
  imports: [CommonModule, RouterOutlet, OrderRoutingModule],
  exports: [],
})
export class OrderModule {
}
