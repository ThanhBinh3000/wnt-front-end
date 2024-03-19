import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'doctor-add-edit-dialog',
  templateUrl: './doctor-add-edit-dialog.component.html',
  styleUrls: ['./doctor-add-edit-dialog.component.css'],
})
export class DoctorAddEditDialogComponent implements OnInit {
  @Input() customerGroupID = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}