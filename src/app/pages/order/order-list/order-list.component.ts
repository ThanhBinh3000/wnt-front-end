import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  title: string = "Tra cứu đơn đặt hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
