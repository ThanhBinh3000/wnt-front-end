import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sample-note',
  templateUrl: './sample-note-list.component.html',
  styleUrls: ['./sample-note-list.component.css'],
})
export class SampleNoteListComponent implements OnInit {
  title: string = "DANH SÁCH KÊ ĐƠN/LIỀU MẪU";
  sampleNoteID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}