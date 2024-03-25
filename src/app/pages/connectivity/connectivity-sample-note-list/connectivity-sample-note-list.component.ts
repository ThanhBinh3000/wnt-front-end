import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'connectivity-sample-note-list',
  templateUrl: './connectivity-sample-note-list.component.html',
  styleUrls: ['./connectivity-sample-note-list.component.css'],
})
export class ConnectivitySampleNoteListComponent implements OnInit {
  title: string = "Quản lý đơn thuốc liên thông";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}