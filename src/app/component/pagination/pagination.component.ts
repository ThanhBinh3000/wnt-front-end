import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit  {

  @Input() currentPage: number;
  @Input() totalPages: number;
  @Input() totalRecord : number;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  ngOnInit() {

  }

  onPageChange(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }

  onPageSizeChange($event) {
    this.pageSizeChange.emit($event.value);
  }

  getPages(): number[] {
    const totalPagesToShow = 9; // Số trang hiển thị tối đa
    const pages : number[] = [];
    const half = Math.floor(totalPagesToShow / 2);

    let start = this.currentPage - half;
    let end = this.currentPage + half;

    if (start <= 0) {
      start = 1;
      end = totalPagesToShow;
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = this.totalPages - totalPagesToShow + 1;
      if (start <= 0) {
        start = 1;
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }


}
