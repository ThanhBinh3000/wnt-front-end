import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'return-from-customer-note-screen',
  templateUrl: './return-from-customer-note-screen.component.html',
  styleUrls: ['./return-from-customer-note-screen.component.css'],
})
export class ReturnFromCustomerNoteScreenComponent implements OnInit {
  title: string = "Phiếu trả lại từ khách hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}