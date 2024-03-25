import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cancel-delivery-note-detail',
  templateUrl: './cancel-delivery-note-detail.component.html',
  styleUrls: ['./cancel-delivery-note-detail.component.css'],
})
export class CancelDeliveryNoteDetailComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}