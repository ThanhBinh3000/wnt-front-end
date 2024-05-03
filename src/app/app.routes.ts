import {RouterModule, Routes} from '@angular/router';
import {NotAuthenComponent} from "./pages/not-authen/not-authen.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {NgModule} from "@angular/core";
import {AuthGuard} from "./guard/auth.guard";

export const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'management/home'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'tiep-nhan',
    loadChildren: () =>
      import('./pages/tiep-nhan/tiep-nhan.module').then((m) => m.TiepNhanModule)
  },
  {
    path: 'tra-cuu-don-thuoc-dien-tu',
    loadChildren: () =>
      import('./pages/tra-cuu-don-thuoc-dien-tu/tra-cuu-don-thuoc-dien-tu.module').then((m) => m.TraCuuDonThuocDienTuModule)
  },
  {
    path: '401',
    component: NotAuthenComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
