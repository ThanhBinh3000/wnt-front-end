import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-medical-note-history-list',
  templateUrl: './medical-note-history-list.component.html',
  styleUrls: ['./medical-note-history-list.component.css'],
})
export class MedicalNoteHistoryListComponent implements OnInit {
  title: string = "LỊCH SỬ KHÁM CHỮA BỆNH";
  waitNoteID: number = 0;
  type: number = 1;
  deviceType: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
