import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'account-add-edit-dialog',
  templateUrl: './account-add-edit-dialog.component.html',
  styleUrl: './account-add-edit-dialog.component.css'
})
export class AccountAddEditDialogComponent implements OnInit {
  @Input() userId: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}
