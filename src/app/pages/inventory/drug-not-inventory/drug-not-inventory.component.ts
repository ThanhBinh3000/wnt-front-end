import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-drug-not-inventory',
  templateUrl: './drug-not-inventory.component.html',
  styleUrl: './drug-not-inventory.component.css'
})
export class DrugNotInventoryComponent implements OnInit {
  title: string = "Danh sách thuốc chưa kiểm kê";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
