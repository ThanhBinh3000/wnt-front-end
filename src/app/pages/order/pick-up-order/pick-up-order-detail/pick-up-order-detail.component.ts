import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pick-up-order-detail',
  templateUrl: './pick-up-order-detail.component.html',
  styleUrl: './pick-up-order-detail.component.css'
})
export class PickUpOrderDetailComponent implements OnInit {
  title: string = "Phiếu nhặt hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
