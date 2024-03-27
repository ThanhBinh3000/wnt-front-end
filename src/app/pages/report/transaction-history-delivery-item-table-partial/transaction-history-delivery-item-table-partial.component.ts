import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'transaction-history-delivery-item-table-partial',
  templateUrl: './transaction-history-delivery-item-table-partial.component.html',
  styleUrl: './transaction-history-delivery-item-table-partial.component.css'
})
export class TransactionHistoryDeliveryItemTablePartialComponent implements OnInit {
  @Input() drugId : number = 0;
  constructor(
  ) {
  }

  ngOnInit() {

  }
}