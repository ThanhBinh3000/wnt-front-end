import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import { RegionInformationRoutingModule } from './region-information.routing';
import { RegionInformationEditDialogComponent } from './region-information-edit-dialog/region-information-edit-dialog.component';
import { ComponentsModule } from '../../component/base/components.module';
import { RegionInformationComponent } from './region-information.component';

@NgModule({
  declarations: [
    RegionInformationComponent,
    RegionInformationEditDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, RegionInformationRoutingModule, ComponentsModule],
  exports: [RegionInformationEditDialogComponent],
})
export class RegionInformationModule {
}
