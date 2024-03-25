import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
})
export class NoteListComponent implements OnInit {
  title: string = "Tra cứu phiếu Nhập/Xuất";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}