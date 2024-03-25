import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'delivery-note-barcode-screen',
  templateUrl: './delivery-note-barcode-screen.component.html',
  styleUrls: ['./delivery-note-barcode-screen.component.css'],
})
export class DeliveryNoteBarcodeScreenComponent implements OnInit {
  title: string = "Phiếu bán hàng với mã vạch";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}