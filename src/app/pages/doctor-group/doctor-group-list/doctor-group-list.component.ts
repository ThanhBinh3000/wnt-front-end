import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'doctor-group-list',
  templateUrl: './doctor-group-list.component.html',
  styleUrls: ['./doctor-group-list.component.css'],
})
export class DoctorGroupListComponent implements OnInit {
  title: string = "Danh sách nhóm bác sỹ";
  doctorGroupID: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}