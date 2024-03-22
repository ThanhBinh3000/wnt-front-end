import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-wait-note',
  templateUrl: './wait-note-list.component.html',
  styleUrls: ['./wait-note-list.component.css'],
})
export class WaitNoteListComponent implements OnInit {
  title: string = "Tiếp đón bệnh nhân";
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