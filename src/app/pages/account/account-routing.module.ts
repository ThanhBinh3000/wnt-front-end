import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from "./account.component";
import {AuthGuard} from "../../guard/auth.guard";
import {ChooseNhaThuocComponent} from "./choose-nha-thuoc/choose-nha-thuoc.component";
import {ChangeStaffComponent} from "./change-staff/change-staff.component";
import {StaffPermissionComponent} from "./staff-permission/staff-permission.component";
import { StaffListComponent } from './staff-list/staff-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        redirectTo: '/management/home',
        pathMatch: 'full',
      },
      {
        path: 'choose-nha-thuoc',
        component: ChooseNhaThuocComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'change-staff',
        component: ChangeStaffComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'staff-permission',
        component: StaffPermissionComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'staff-list',
        component: StaffListComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {
}
