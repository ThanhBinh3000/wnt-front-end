import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-note-reserve-detail',
  templateUrl: './note-reserve-detail.component.html',
  styleUrl: './note-reserve-detail.component.css'
})
export class NoteReserveDetailComponent implements OnInit {
  @Input() noteId: number = 0;
  title: string = "Lập dự trù";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
