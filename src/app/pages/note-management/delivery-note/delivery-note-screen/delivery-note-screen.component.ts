import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'delivery-note-screen',
  templateUrl: './delivery-note-screen.component.html',
  styleUrls: ['./delivery-note-screen.component.css'],
})
export class DeliveryNoteScreenComponent implements OnInit {
  title: string = "Phiếu bán hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}