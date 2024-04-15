import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrl: './date-range-filter.component.css'
})
export class DateRangeFilterComponent implements OnInit {

  @Input() filterType: number = 0;

  @Output() filterTypeChange = new EventEmitter<number>();
  @Output() fromDateChange = new EventEmitter<number>();
  @Output() toDateChange = new EventEmitter<number>();

  ngOnInit() {

  }

  onFilterTypeChange(filterType: number) {
    this.filterTypeChange.emit(filterType);
  }

  onFromDateChange(fromDate: number) {
    this.fromDateChange.emit(fromDate);
  }

  onToDateChange(toDate: number) {
    this.toDateChange.emit(toDate);
  }
}
