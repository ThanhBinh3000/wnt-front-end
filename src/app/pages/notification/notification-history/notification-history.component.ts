import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-notification-history',
  templateUrl: './notification-history.component.html',
  styleUrl: './notification-history.component.css'
})
export class NotificationHistoryComponent implements OnInit {
  title: string = "Lịch sử thông báo";
  id : number = 0;
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
