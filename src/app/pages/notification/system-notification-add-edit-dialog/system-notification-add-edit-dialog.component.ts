import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'system-notification-add-edit-dialog',
  templateUrl: './system-notification-add-edit-dialog.component.html',
  styleUrl: './system-notification-add-edit-dialog.component.css'
})
export class SystemNotificationAddEditDialogComponent implements OnInit {
  @Input() id: number = 0;
  title: string = this.id > 0 ? "Cập nhật thông báo" : "Tạo thông báo";
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}