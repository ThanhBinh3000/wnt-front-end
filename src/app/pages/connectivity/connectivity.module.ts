import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectivityComponent} from './connectivity.component';
import {RouterOutlet} from "@angular/router";
import {ConnectivityRoutingModule} from "./connectivity.routing";
import { ConnectivityListComponent } from './connectivity-list/connectivity-list.component';
import { ConnectivitySampleNoteListComponent } from './connectivity-sample-note-list/connectivity-sample-note-list.component';

@NgModule({
  declarations: [
    ConnectivityComponent,
    ConnectivityListComponent,
    ConnectivitySampleNoteListComponent
  ],
  imports: [CommonModule, RouterOutlet, ConnectivityRoutingModule],
  exports: [
  ],
})
export class ConnectivityModule {
}
