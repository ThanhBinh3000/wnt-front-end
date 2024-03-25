import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'delivery-note-es-screen',
  templateUrl: './delivery-note-es-screen.component.html',
  styleUrls: ['./delivery-note-es-screen.component.css'],
})
export class DeliveryNoteESScreenComponent implements OnInit {
  title: string = "Phiếu bán hàng với đơn thuốc điện tử";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}