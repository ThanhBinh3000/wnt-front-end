import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-note-reserve-add-edit',
  templateUrl: './note-reserve-add-edit.component.html',
  styleUrl: './note-reserve-add-edit.component.css'
})
export class NoteReserveAddEditComponent implements OnInit {
  @Input() noteId: number = 0;
  title: string = "Lập dự trù";
  supplierID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}

