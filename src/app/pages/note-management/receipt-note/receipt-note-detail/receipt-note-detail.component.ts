import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'receipt-note-detail',
  templateUrl: './receipt-note-detail.component.html',
  styleUrls: ['./receipt-note-detail.component.css'],
})
export class ReceiptNoteDetailComponent implements OnInit {
  title: string = "Phiếu nhập hàng #123";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}