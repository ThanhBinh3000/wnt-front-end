import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'service-add-edit-dialog',
  templateUrl: './service-add-edit-dialog.component.html',
  styleUrls: ['./service-add-edit-dialog.component.css'],
})
export class ServiceAddEditDialogComponent implements OnInit {
  @Input() serviceID: number = 0;
  @Input() location: string = 'body';

  constructor() {
  }

  ngOnInit() {
  }

}