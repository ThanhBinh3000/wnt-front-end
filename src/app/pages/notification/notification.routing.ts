import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import { NotificationComponent } from './notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { SystemNotificationListComponent } from './system-notification-list/system-notification-list.component';
import { NotificationHistoryComponent } from './notification-history/notification-history.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    children: [
      {
        path: 'notification-list',
        component: NotificationListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'system-notification-list',
        component: SystemNotificationListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'notification-history',
        component: NotificationHistoryComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {
}
