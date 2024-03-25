import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'clinic-add-edit-dialog',
  templateUrl: './clinic-add-edit-dialog.component.html',
  styleUrl: './clinic-add-edit-dialog.component.css'
})
export class ClinicAddEditDialogComponent implements OnInit {
  @Input() clinicID : number = 0;
  title: string = this.clinicID > 0 ? "Cập nhật thông tin" : "Thêm mới thông tin";
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}