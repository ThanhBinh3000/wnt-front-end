import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-form-quick',
  templateUrl: './form-quick.component.html',
  styleUrl: './form-quick.component.css'
})
export class FormQuickComponent implements OnInit {
  title: string = "Phiếu nhặt hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
