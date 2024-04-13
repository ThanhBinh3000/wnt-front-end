import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import { UtilitiesRoutingModule } from './utilities.routing';
import { RegionInformationEditDialogComponent } from './region-information-edit-dialog/region-information-edit-dialog.component';
import { ComponentsModule } from '../../component/base/components.module';
import { UtilitiesComponent } from './utilities.component';

@NgModule({
  declarations: [
    UtilitiesComponent,
    RegionInformationEditDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, UtilitiesRoutingModule, ComponentsModule],
  exports: [],
})
export class UtilitiesModule {
}
