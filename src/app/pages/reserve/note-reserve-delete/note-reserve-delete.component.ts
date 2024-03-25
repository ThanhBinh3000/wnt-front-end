import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-note-reserve-delete',
  templateUrl: './note-reserve-delete.component.html',
  styleUrl: './note-reserve-delete.component.css'
})
export class NoteReserveDeleteComponent implements OnInit {
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
