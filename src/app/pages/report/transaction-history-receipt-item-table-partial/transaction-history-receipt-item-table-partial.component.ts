import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'transaction-history-receipt-item-table-partial',
  templateUrl: './transaction-history-receipt-item-table-partial.component.html',
  styleUrl: './transaction-history-receipt-item-table-partial.component.css'
})
export class TransactionHistoryReceiptItemTablePartialComponent implements OnInit {
  @Input() drugId : number = 0;
  constructor(
  ) {
  }

  ngOnInit() {

  }
}
