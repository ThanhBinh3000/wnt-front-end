import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list-order-pick-up',
  templateUrl: './list-order-pick-up.component.html',
  styleUrl: './list-order-pick-up.component.css'
})
export class ListOrderPickUpComponent implements OnInit {
  title: string = "Tra cứu đơn nhặt";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}

