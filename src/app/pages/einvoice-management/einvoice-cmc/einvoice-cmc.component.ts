import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'einvoice-cmc',
  templateUrl: './einvoice-cmc.component.html',
  styleUrls: ['./einvoice-cmc.component.css'],
})
export class EInvoiceCMCComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}