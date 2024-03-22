import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'service-detail-dialog',
  templateUrl: './service-detail-dialog.component.html',
  styleUrls: ['./service-detail-dialog.component.css'],
})
export class ServiceDetailDialogComponent implements OnInit {
  @Input() serviceID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

}