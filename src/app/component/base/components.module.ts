import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from "../pagination/pagination.component";
import {ModalComponent} from "../modal/modal.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ToastrModule} from "ngx-toastr";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgOptionHighlightModule} from "@ng-select/ng-option-highlight";

@NgModule({
  declarations: [
    //components
    PaginationComponent,
    ModalComponent
    //pipes
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    ModalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule {
}
