import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TiepNhanComponent} from './tiep-nhan.component';
import {TiepNhanRouting} from "./tiep-nhan.routing";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    TiepNhanComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TiepNhanRouting,
    RouterModule,
  ],
  exports: [
    TiepNhanComponent
  ],
  providers: []
})
export class TiepNhanModule {
}
