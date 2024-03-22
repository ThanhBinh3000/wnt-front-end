import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-handle-order',
  templateUrl: './handle-order.component.html',
  styleUrl: './handle-order.component.css'
})
export class HandleOrderComponent implements OnInit {
  title: string = "Xử lý đơn nhặt";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
