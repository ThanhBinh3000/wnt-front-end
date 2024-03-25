import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'return-to-supplier-note-detail',
  templateUrl: './return-to-supplier-note-detail.component.html',
  styleUrls: ['./return-to-supplier-note-detail.component.css'],
})
export class ReturnToSupplierNoteDetailComponent implements OnInit {
  title: string = "";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}