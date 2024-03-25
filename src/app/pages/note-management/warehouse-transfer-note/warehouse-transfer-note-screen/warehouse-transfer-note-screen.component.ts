import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'warehouse-transfer-note-screen',
  templateUrl: './warehouse-transfer-note-screen.component.html',
  styleUrls: ['./warehouse-transfer-note-screen.component.css'],
})
export class WarehouseTransferNoteScreenComponent implements OnInit {
  title: string = "Phiếu chuyển kho";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}