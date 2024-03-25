import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'return-to-supplier-note-screen',
  templateUrl: './return-to-supplier-note-screen.component.html',
  styleUrls: ['./return-to-supplier-note-screen.component.css'],
})
export class ReturnToSupplierNoteScreenComponent implements OnInit {
  title: string = "Phiếu trả lại hàng trả cung cấp";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}