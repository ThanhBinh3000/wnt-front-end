import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from "../pagination/pagination.component";
import {ModalComponent} from "../modal/modal.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ToastrModule} from "ngx-toastr";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgOptionHighlightModule} from "@ng-select/ng-option-highlight";
import {AppDatePipe} from "../pipe/app-date.pipe";
import {AppDateTimePipe} from "../pipe/app-date-time.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    //components
    PaginationComponent,
    ModalComponent,
    //pipes
    AppDatePipe,
    AppDateTimePipe
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatSortModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatSortModule,
    ToastrModule,
    PaginationComponent,
    ModalComponent,
    AppDatePipe,
    AppDateTimePipe
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule {
}
