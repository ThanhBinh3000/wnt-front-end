import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'service-group-list',
  templateUrl: './service-group-list.component.html',
  styleUrls: ['./service-group-list.component.css'],
})
export class ServiceGroupListComponent implements OnInit {
  title: string = "Danh sách nhóm dịch vụ";
  serviceGroupID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}