import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-system-notification-list',
  templateUrl: './system-notification-list.component.html',
  styleUrl: './system-notification-list.component.css'
})
export class SystemNotificationListComponent implements OnInit {
  title: string = "Danh sách thông báo hệ thống";
  id : number = 0;
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
