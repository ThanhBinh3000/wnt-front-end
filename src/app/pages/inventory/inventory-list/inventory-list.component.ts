import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css'
})
export class InventoryListComponent implements OnInit {
  title: string = "Danh sách phiếu kiểm kê";
  noteId : number = 0;
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
