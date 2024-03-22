import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './outcoming-note-add-edit.component.html',
  styleUrls: ['./outcoming-note-add-edit.component.css'],
})
export class OutComingNoteAddEditComponent implements OnInit {
  title: string = "PHIẾU CHI";
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