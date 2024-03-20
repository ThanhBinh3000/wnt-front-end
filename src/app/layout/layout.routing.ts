import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {HomeComponent} from "../pages/home/home.component";
import {NotificationComponent} from "../pages/notification/notification.component";
import {AuthGuard} from "../guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'account',
        loadChildren: () => import('../pages/account/account.module').then((m) => m.AccountModule),
      },
      {
        path: 'partner',
        loadChildren: () => import('../pages/partner/partner.module').then((m) => m.PartnerModule),
      },
      {
        path: 'notification',
        component: NotificationComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRouting {
}
