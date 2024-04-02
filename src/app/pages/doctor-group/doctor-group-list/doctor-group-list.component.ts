import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NhomBacSiService } from '../../../services/categories/nhom-bac-si.service';
import {BaseComponent} from "../../../component/base/base.component";
import {MatDialog} from "@angular/material/dialog";
import { DoctorGroupAddEditDialogComponent } from '../doctor-group-add-edit-dialog/doctor-group-add-edit-dialog.component';

@Component({
  selector: 'doctor-group-list',
  templateUrl: './doctor-group-list.component.html',
  styleUrls: ['./doctor-group-list.component.css'],
})
export class DoctorGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm bác sỹ";

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : NhomBacSiService,
    private dialog: MatDialog
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
        tenNhomBacSy : [],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.searchPage();
  }

  async openAddEditDialog(doctorGroupID: any) {
    const dialogRef = this.dialog.open(DoctorGroupAddEditDialogComponent, {
      data: doctorGroupID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}