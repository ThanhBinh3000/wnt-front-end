import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'doctor-group-add-edit-dialog',
  templateUrl: './doctor-group-add-edit-dialog.component.html',
  styleUrls: ['./doctor-group-add-edit-dialog.component.css'],
})
export class DoctorGroupAddEditDialogComponent implements OnInit {
  @Input() doctorGroupID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }
}