import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'warehouse-transfer-note-detail',
  templateUrl: './warehouse-transfer-note-detail.component.html',
  styleUrls: ['./warehouse-transfer-note-detail.component.css'],
})
export class WarehouseTransferNoteDetailComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}