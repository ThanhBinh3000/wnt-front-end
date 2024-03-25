import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterOutlet} from "@angular/router";
import {NotificationRoutingModule} from './notification.routing';
import { NotificationComponent } from './notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationAddEditDialogComponent } from './notification-add-edit-dialog/notification-add-edit-dialog.component';
import { SystemNotificationListComponent } from './system-notification-list/system-notification-list.component';
import { NotificationHistoryComponent } from './notification-history/notification-history.component';
import { SystemNotificationAddEditDialogComponent } from './system-notification-add-edit-dialog/system-notification-add-edit-dialog.component';
import { SystemNotificationDetailDialogComponent } from './system-notification-detail-dialog/system-notification-detail-dialog.component';
@NgModule({
  declarations: [
    NotificationComponent,
    NotificationListComponent,
    NotificationAddEditDialogComponent,
    SystemNotificationListComponent,
    NotificationHistoryComponent,
    SystemNotificationAddEditDialogComponent,
    SystemNotificationDetailDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, NotificationRoutingModule],
  exports: [],
})
export class NotificationModule {
}
