import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-drug-transaction-history',
  templateUrl: './drug-transaction-history.component.html',
  styleUrl: './drug-transaction-history.component.css'
})
export class DrugTransactionHistoryComponent implements OnInit {
  title: string = "TRA CỨU LỊCH SỬ GIAO DỊCH";
  drugId : number = 0;
  checkTab: string = 'receipt';
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
