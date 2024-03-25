import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './other-in-out-note-add-edit.component.html',
  styleUrls: ['./other-in-out-note-add-edit.component.css'],
})
export class OtherInOutNoteAddEditComponent implements OnInit {
  title: string = "THU CHI KHÁC";
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