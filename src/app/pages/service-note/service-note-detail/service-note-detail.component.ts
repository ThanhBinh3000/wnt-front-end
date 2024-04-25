import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note-detail.component.html',
  styleUrls: ['./service-note-detail.component.css'],
})
export class ServiceNoteDetailComponent implements OnInit {
  title: string = "PHIẾU DỊCH VỤ";
  serviceNoteID: number = 0;
  deviceType: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
