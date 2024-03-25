import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'delivery-note-detail',
  templateUrl: './delivery-note-detail.component.html',
  styleUrls: ['./delivery-note-detail.component.css'],
})
export class DeliveryNoteDetailComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}