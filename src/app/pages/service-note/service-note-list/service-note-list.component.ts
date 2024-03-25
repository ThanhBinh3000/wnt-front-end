import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note-list.component.html',
  styleUrls: ['./service-note-list.component.css'],
})
export class ServiceNoteListComponent implements OnInit {
  title: string = "DANH SÁCH PHIẾU DỊCH VỤ";
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