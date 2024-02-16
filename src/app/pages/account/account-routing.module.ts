import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from "./account.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {AuthGuard} from "../../guard/auth.guard";
import {ChooseDepartmentComponent} from "./choose-department/choose-department.component";
import {ChangeStaffComponent} from "./change-staff/change-staff.component";

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'change-password',
        pathMatch: 'full',
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'choose-department',
        component: ChooseDepartmentComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'change-staff',
        component: ChangeStaffComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {
}
