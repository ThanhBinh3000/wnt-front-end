import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cancel-delivery-note-screen',
  templateUrl: './cancel-delivery-note-screen.component.html',
  styleUrls: ['./cancel-delivery-note-screen.component.css'],
})
export class CancelDeliveryNoteScreenComponent implements OnInit {
  title: string = "Phiếu xuất huỷ";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}