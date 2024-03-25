import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-receipt-medical-fee',
  templateUrl: './receipt-medical-fee-list.component.html',
  styleUrls: ['./receipt-medical-fee-list.component.css'],
})
export class ReceiptMedicalFeeListComponent implements OnInit {
  title: string = "DANH SÁCH PHIẾU THU TIỀN KHÁM BỆNH";
  waitNoteID: number = 0;
  type: number = 1;
  deviceType: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}