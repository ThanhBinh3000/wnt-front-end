import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'receipt-note-screen',
  templateUrl: './receipt-note-screen.component.html',
  styleUrls: ['./receipt-note-screen.component.css'],
})
export class ReceiptNoteScreenComponent implements OnInit {
  title: string = "Phiếu nhập hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}