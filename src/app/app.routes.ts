import {Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import {NotAuthenComponent} from "./pages/not-authen/not-authen.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {HomeComponent} from "./pages/home/home.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
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
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
