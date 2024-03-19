import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'doctor-add-edit-dialog',
  templateUrl: './doctor-add-edit-dialog.component.html',
  styleUrls: ['./doctor-add-edit-dialog.component.css'],
})
export class DoctorAddEditDialogComponent implements OnInit {
  @Input() doctorID: number = 0;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';

  constructor() {
  }

  ngOnInit() {
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
}