import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'deleted-note-list',
  templateUrl: './deleted-note-list.component.html',
  styleUrls: ['./deleted-note-list.component.css'],
})
export class DeletedNoteListComponent implements OnInit {
  title: string = "Khôi phục các chứng từ bị xoá";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}