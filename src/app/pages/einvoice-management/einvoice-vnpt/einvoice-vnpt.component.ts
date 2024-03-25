import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'einvoice-vnpt',
  templateUrl: './einvoice-vnpt.component.html',
  styleUrls: ['./einvoice-vnpt.component.css'],
})
export class EInvoiceVNPTComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}