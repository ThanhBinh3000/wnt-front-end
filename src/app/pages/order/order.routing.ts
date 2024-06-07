import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrderComponent} from "./order.component";
import {AuthGuard} from "../../guard/auth.guard";
import { SearchDrugComponent } from './search-drug/search-drug.component';
import { FormQuickComponent } from './pick-up-order/form-quick/form-quick.component';
import { HandleOrderComponent } from './pick-up-order/handle-order/handle-order.component';
import { ListOrderPickUpComponent } from './pick-up-order/list-order-pick-up/list-order-pick-up.component';
import { PickUpOrderDetailComponent } from './pick-up-order/pick-up-order-detail/pick-up-order-detail.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import {ListOrderAssignComponent} from "./list-order-assign/list-order-assign.component";
import {ListDrugToBuyComponent} from "./list-drug-to-buy/list-drug-to-buy.component";
import {ConfirmDeliveryComponent} from "./confirm-delivery/confirm-delivery.component";

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: 'search-drug',
        component: SearchDrugComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'form-quick',
        component: FormQuickComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'form-quick/:id',
        component: FormQuickComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'handle-order/:id',
        component: HandleOrderComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'list-order-pick-up',
        component: ListOrderPickUpComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'pick-up-order-detail/:id',
        component: PickUpOrderDetailComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'create-order/:id',
        component: CreateOrderComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'order-list',
        component: OrderListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'list-order-assign',
        component: ListOrderAssignComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'list-drug-buy',
        component: ListDrugToBuyComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'confirm-delivery',
        component: ConfirmDeliveryComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {
}
