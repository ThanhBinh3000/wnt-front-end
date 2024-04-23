import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceGroupComponent } from './service-group.component';
import { RouterOutlet } from "@angular/router";
import { ServiceGroupRoutingModule } from "./service-group.routing";
import { ServiceGroupAddEditDialogComponent } from './service-group-add-edit-dialog/service-group-add-edit-dialog.component';
import { ServiceGroupListComponent } from './service-group-list/service-group-list.component';
import { ComponentsModule } from '../../component/base/components.module';

@NgModule({
  declarations: [
    ServiceGroupComponent,
    ServiceGroupListComponent,
    ServiceGroupAddEditDialogComponent,
  ],
  imports: [ComponentsModule, CommonModule, RouterOutlet, ServiceGroupRoutingModule],
  exports: [
    ServiceGroupAddEditDialogComponent
  ],
})
export class ServiceGroupModule {
}
