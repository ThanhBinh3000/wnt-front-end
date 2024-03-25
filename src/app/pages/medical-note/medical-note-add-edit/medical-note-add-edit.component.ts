import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-medical-note',
  templateUrl: './medical-note-add-edit.component.html',
  styleUrls: ['./medical-note-add-edit.component.css'],
})
export class MedicalNoteAddEditComponent implements OnInit {
  title: string = "PHIẾU KHÁM BỆNH";
  medicalNoteID: number = 0;
  deviceType: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}