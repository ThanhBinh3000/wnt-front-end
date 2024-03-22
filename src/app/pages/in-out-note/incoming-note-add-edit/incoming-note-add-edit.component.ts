import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './incoming-note-add-edit.component.html',
  styleUrls: ['./incoming-note-add-edit.component.css'],
})
export class InComingNoteAddEditComponent implements OnInit {
  title: string = "PHIẾU THU";
  inComingNoteID: number = 0;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
  
  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
}