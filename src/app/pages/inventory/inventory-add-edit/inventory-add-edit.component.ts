import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inventory-add-edit',
  templateUrl: './inventory-add-edit.component.html',
  styleUrl: './inventory-add-edit.component.css'
})
export class InventoryAddEditComponent implements OnInit {
  @Input() noteId: number = 0;
  title: string = this.noteId > 0 ? "Cập nhật phiếu kiểm kê" : "Tạo phiếu kiểm kê";
  drugId: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
