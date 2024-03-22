import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { RouterOutlet } from "@angular/router";
import { ServiceRoutingModule } from "./service.routing";
import { ServiceAddEditDialogComponent } from './service-add-edit-dialog/service-add-edit-dialog.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceDetailDialogComponent } from './service-detail-dialog/service-detail-dialog.component';

@NgModule({
  declarations: [
    ServiceComponent,
    ServiceListComponent,
    ServiceAddEditDialogComponent,
    ServiceDetailDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, ServiceRoutingModule],
  exports: [
    ServiceAddEditDialogComponent,
    ServiceDetailDialogComponent
  ],
})
export class ServiceModule {
}
