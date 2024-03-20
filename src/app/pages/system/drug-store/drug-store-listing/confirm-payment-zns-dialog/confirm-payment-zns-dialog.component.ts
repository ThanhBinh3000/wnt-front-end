import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'confirm-payment-zns-dialog',
  templateUrl: './confirm-payment-zns-dialog.component.html',
  styleUrl: './confirm-payment-zns-dialog.component.css'
})
export class ConfirmPaymentZnsDialogComponent implements OnInit {
  @Input() drugStoreCode: string = '';
  
  constructor() {
  }

  ngOnInit() {
  }
}
