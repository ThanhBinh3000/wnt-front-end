import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'drug-unit-list',
  templateUrl: './drug-unit-list.component.html',
  styleUrls: ['./drug-unit-list.component.css'],
})
export class DrugUnitListComponent implements OnInit {
  title: string = "Danh sách đơn vị tính";
  drugUnitID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}