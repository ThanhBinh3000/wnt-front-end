import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectivityComponent} from './connectivity.component';
import {RouterOutlet} from "@angular/router";
import {ConnectivityRoutingModule} from "./connectivity.routing";
import { ConnectivityListComponent } from './connectivity-list/connectivity-list.component';
import { ConnectivitySampleNoteListComponent } from './connectivity-sample-note-list/connectivity-sample-note-list.component';
import { ComponentsModule } from '../../component/base/components.module';
import { ConnectivityReceiptItemTableComponent } from './connectivity-list/connectivity-receipt-item-table/connectivity-receipt-item-table.component';
import { ConnectivityDeliveryItemTableComponent } from './connectivity-list/connectivity-delivery-item-table/connectivity-delivery-item-table.component';
import { ConnectivityDrugItemTableComponent } from './connectivity-list/connectivity-drug-item-table/connectivity-drug-item-table.component';
import { ConnectivityNoteGuideDialogComponent } from './connectivity-list/connectivity-note-guide-dialog/connectivity-note-guide-dialog.component';

@NgModule({
  declarations: [
    ConnectivityComponent,
    ConnectivityListComponent,
    ConnectivitySampleNoteListComponent,
    ConnectivityReceiptItemTableComponent,
    ConnectivityDeliveryItemTableComponent,
    ConnectivityDrugItemTableComponent,
    ConnectivityNoteGuideDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, ConnectivityRoutingModule, ComponentsModule],
  exports: [
  ],
})
export class ConnectivityModule {
}
