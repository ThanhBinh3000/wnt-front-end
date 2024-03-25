import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'system-notification-detail-dialog',
  templateUrl: './system-notification-detail-dialog.component.html',
  styleUrl: './system-notification-detail-dialog.component.css'
})
export class SystemNotificationDetailDialogComponent implements OnInit {
  @Input() id: number = 0;
  constructor(
  ) {
  }

  ngOnInit() {
    
  }
}