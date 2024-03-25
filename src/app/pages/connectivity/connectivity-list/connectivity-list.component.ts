import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'connectivity-list',
  templateUrl: './connectivity-list.component.html',
  styleUrls: ['./connectivity-list.component.css'],
})
export class ConnectivityListComponent implements OnInit {
  title: string = "Quản lý liên thông";
  checkTab: string = 'receipt-note-list';

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}