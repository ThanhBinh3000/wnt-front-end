import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'service-group-add-edit-dialog',
  templateUrl: './service-group-add-edit-dialog.component.html',
  styleUrls: ['./service-group-add-edit-dialog.component.css'],
})
export class ServiceGroupAddEditDialogComponent implements OnInit {
  @Input() serviceGroupID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }
}