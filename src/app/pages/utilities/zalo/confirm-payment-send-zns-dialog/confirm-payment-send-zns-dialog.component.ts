import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'confirm-payment-send-zns-dialog',
  templateUrl: './confirm-payment-send-zns-dialog.component.html',
  styleUrl: './confirm-payment-send-zns-dialog.component.css'
})
export class ConfirmPaymentSendZnsDialogComponent  implements OnInit {
  @Input() drugStoreCode: string = '';
  
  constructor() {
  }

  ngOnInit() {
  }
}
