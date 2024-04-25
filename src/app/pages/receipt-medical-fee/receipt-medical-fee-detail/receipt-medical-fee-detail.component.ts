import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-receipt-medical-fee',
  templateUrl: './receipt-medical-fee-detail.component.html',
  styleUrls: ['./receipt-medical-fee-detail.component.css'],
})
export class ReceiptMedicalFeeDetailComponent implements OnInit {
  title: string = "PHIẾU THU TIỀN";
  receiptMedicalFeeID: number = 0;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
}
