import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sample-note-add-edit',
  templateUrl: './sample-note-add-edit.component.html',
  styleUrls: ['./sample-note-add-edit.component.css'],
})
export class SampleNoteAddEditComponent implements OnInit {
  @Input() sampleNoteID = 0;
  title: string = "Thông tin chung đơn/liều mẫu";
  currentDrugStoreCode: string = "0010";
  action: string = "create";
  isClinic: boolean = false;
  isConnect: boolean = false;
  deviceType: number = 0;
  customerID: number = 0;
  doctorID: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}