import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './in-out-note-list.component.html',
  styleUrls: ['./in-out-note-list.component.css'],
})
export class InOutNoteListComponent implements OnInit {
  title: string = "TRA CỨU PHIẾU THU CHI";
  waitNoteID: number = 0;
  statusExam: number = 1;
  type: number = 1;
  customerID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}