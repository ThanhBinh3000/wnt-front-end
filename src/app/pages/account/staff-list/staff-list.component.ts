import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
})
export class StaffListComponent implements OnInit {
  title: string = "Danh sách nhân viên";
  staffID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}