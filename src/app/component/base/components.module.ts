import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from "../pagination/pagination.component";
import {NzModalModule} from "ng-zorro-antd/modal";


@NgModule({
  declarations: [
    //components
    //pipes
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    NzModalModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule {
}
