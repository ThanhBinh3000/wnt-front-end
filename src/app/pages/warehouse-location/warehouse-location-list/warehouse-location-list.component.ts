import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'warehouse-location-list',
  templateUrl: './warehouse-location-list.component.html',
  styleUrls: ['./warehouse-location-list.component.css'],
})
export class WarehouseLocationListComponent implements OnInit {
  title: string = "Quản lý vị trí tủ/kho";
  warehouseLocationID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}