import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-partner',
  templateUrl: './supplier-group-list.component.html',
  styleUrls: ['./supplier-group-list.component.css'],
})
export class SupplierGroupListComponent implements OnInit {
  title: string = "Danh sách nhóm nhà cung cấp";
  supplierGroupID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}