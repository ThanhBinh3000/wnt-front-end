import {Component, Injectable, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NhomThuocService} from "../../../services/categories/nhom-thuoc.service";
import {BaseComponent} from "../../../component/base/base.component";
import {DrugGroupAddEditDialogComponent} from "../drug-group-add-edit-dialog/drug-group-add-edit-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  CustomerGroupAddEditDialogComponent
} from "../../customer-group/customer-group-add-edit-dialog/customer-group-add-edit-dialog.component";

@Component({
  selector: 'drug-group-list',
  templateUrl: './drug-group-list.component.html',
  styleUrls: ['./drug-group-list.component.css'],
})
export class DrugGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm thuốc";

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : NhomThuocService,
    private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenNhomThuoc: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }

  async openAddEditDialog(drugGroupID: any) {
    const dialogRef = this.dialog.open(DrugGroupAddEditDialogComponent, {
      data: drugGroupID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}

