import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'account-reset-password-dialog',
  templateUrl: './account-reset-password-dialog.component.html',
  styleUrl: './account-reset-password-dialog.component.css'
})
export class AccountResetPasswordDialogComponent implements OnInit {
  @Input() userId: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}