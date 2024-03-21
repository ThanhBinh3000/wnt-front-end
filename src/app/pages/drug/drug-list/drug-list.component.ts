import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css'],
})
export class DrugListComponent implements OnInit {
  title: string = "Danh sách thuốc";
  drugID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}