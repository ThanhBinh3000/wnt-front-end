import {Component, Injectable, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {BaseComponent} from "../../../component/base/base.component";
import {DrugGroupAddEditDialogComponent} from "../drug-group-add-edit-dialog/drug-group-add-edit-dialog.component";
import { MatSort } from '@angular/material/sort';
import { LOAI_SAN_PHAM } from '../../../constants/config';

@Component({
  selector: 'drug-group-list',
  templateUrl: './drug-group-list.component.html',
  styleUrls: ['./drug-group-list.component.css'],
})
export class DrugGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm thuốc";
  displayedColumns = ['#', 'tenNhomThuoc', 'kyHieuNhomThuoc', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : NhomThuocService,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenNhomThuoc: [],
      typeGroupProduct: [LOAI_SAN_PHAM.THUOC],
      maNhaThuoc: [this.getMaNhaThuocCha()]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }
  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }
  @ViewChild(MatSort) sort?: MatSort;
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

