import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import moment from "moment";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrl: './date-range-filter.component.css'
})
export class DateRangeFilterComponent implements OnInit {

  constructor(private datePipe: DatePipe) { }

  // @ts-ignore
  dateForm: FormGroup;
  @Input() filterType: number = 0;

  @Output() filterTypeChange = new EventEmitter<number>();
  @Output() fromDateChange = new EventEmitter<string>();
  @Output() toDateChange = new EventEmitter<string>();

  ngOnInit() {
    this.initDateRanges();
  }

  onFilterTypeChange(filterType: number) {
    this.filterType = filterType;
    this.filterTypeChange.emit(filterType);
    if(filterType == 1){
      let formattedDate = '';
      const fromDate = this.dateForm.get('pickerFromDate')?.value;
      const toDate = this.dateForm.get('pickerToDate')?.value;
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      this.fromDateChange.emit(formattedDate);
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      this.toDateChange.emit(formattedDate);
    }
  }

  onFromDateChange(fromDate: Date) {
    const toDate = this.dateForm.get('pickerToDate')?.value;
    let formattedDate = '';
    if (toDate && fromDate > toDate) {
      this.dateForm.get('pickerFromDate')?.setValue(toDate);
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }else{
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.fromDateChange.emit(formattedDate);
  }

  onToDateChange(toDate: Date) {
    const fromDate = this.dateForm.get('pickerFromDate')?.value;
    let formattedDate = '';
    if (fromDate && toDate < fromDate) {
      this.dateForm.get('pickerToDate')?.setValue(fromDate);
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    } else {
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.toDateChange.emit(formattedDate);
  }

  initDateRanges() {
    let toDate = moment().utc().startOf('day').toDate();
    let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

    this.dateForm = new FormGroup({
      pickerFromDate: new FormControl(fromDate),
      pickerToDate: new FormControl(toDate)
    });
  }
}
