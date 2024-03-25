import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'return-from-customer-note-detail',
  templateUrl: './return-from-customer-note-detail.component.html',
  styleUrls: ['./return-from-customer-note-detail.component.css'],
})
export class ReturnFromCustomerNoteDetailComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}