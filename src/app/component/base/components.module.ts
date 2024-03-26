import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from "../pagination/pagination.component";


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
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule {
}
