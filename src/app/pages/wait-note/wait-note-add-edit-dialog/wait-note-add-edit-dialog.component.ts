import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wait-note-add-edit-dialog',
  templateUrl: './wait-note-add-edit-dialog.component.html',
  styleUrls: ['./wait-note-add-edit-dialog.component.css'],
})
export class WaitNoteAddEditDialogComponent implements OnInit {
  @Input() waitNoteID = 0;
  customerID: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}