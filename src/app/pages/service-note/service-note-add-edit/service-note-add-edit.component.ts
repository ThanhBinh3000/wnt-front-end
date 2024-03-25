import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note-add-edit.component.html',
  styleUrls: ['./service-note-add-edit.component.css'],
})
export class ServiceNoteAddEditComponent implements OnInit {
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