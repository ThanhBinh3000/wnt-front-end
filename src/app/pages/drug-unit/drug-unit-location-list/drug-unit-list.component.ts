import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DonViTinhService } from '../../../services/products/don-vi-tinh.service';
import { MatDialog } from '@angular/material/dialog';
import {BaseComponent} from "../../../component/base/base.component";
import { DrugUnitAddEditDialogComponent } from '../drug-unit-add-edit-dialog/drug-unit-add-edit-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'drug-unit-list',
  templateUrl: './drug-unit-list.component.html',
  styleUrls: ['./drug-unit-list.component.css'],
})
export class DrugUnitListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách đơn vị tính";
  displayedColumns = ['#', 'tenDonViTinh', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: DonViTinhService,
    // private dialog: MatDialog
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
        tenDonViTinh : [],
        maNhaThuoc: [this.getMaNhaThuocCha()]
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.searchPage();
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

  async openAddEditDialog(drugUnitID: any) {
    const dialogRef = this.dialog.open(DrugUnitAddEditDialogComponent, {
      data: drugUnitID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
