import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrderComponent} from "./order.component";
import {AuthGuard} from "../../guard/auth.guard";
import { SearchDrugComponent } from './search-drug/search-drug.component';
import { FormQuickComponent } from './pick-up-order/form-quick/form-quick.component';
import { HandleOrderComponent } from './pick-up-order/handle-order/handle-order.component';
import { ListOrderPickUpComponent } from './pick-up-order/list-order-pick-up/list-order-pick-up.component';
import { PickUpOrderDetailComponent } from './pick-up-order/pick-up-order-detail/pick-up-order-detail.component';

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
        path: 'handle-order',
        component: HandleOrderComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'list-order-pick-up',
        component: ListOrderPickUpComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'pick-up-order-detail',
        component: PickUpOrderDetailComponent,
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
