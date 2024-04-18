import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
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
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatInput} from "@angular/material/input";
import {NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask, provideNgxMask} from "ngx-mask";
import {SanitizeHtmlPipe} from "../pipe/sanitize-html.pipe";
import {MatRadioButton} from "@angular/material/radio";
import {DateRangeFilterComponent} from "../date-range-filter/date-range-filter.component";
import {CustomDateAdapter} from "../../utils/custom-date-adapter";
import {MatCheckbox} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    //components
    PaginationComponent,
    ModalComponent,
    DateRangeFilterComponent,
    //pipes
    AppDatePipe,
    AppDateTimePipe,
    SanitizeHtmlPipe
    //directives
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
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatRadioButton,
    MatCheckbox,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe
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
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatRadioButton,
    MatCheckbox,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule,
    PaginationComponent,
    ModalComponent,
    DateRangeFilterComponent,
    AppDatePipe,
    AppDateTimePipe,
    SanitizeHtmlPipe,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    DatePipe,
    provideEnvironmentNgxMask(),
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ComponentsModule {
}
