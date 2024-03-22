import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  title: string = "Danh sách dịch vụ";
  serviceID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}