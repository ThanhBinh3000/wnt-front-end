import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { BaseComponent } from '../../../component/base/base.component';
import { MatSort } from '@angular/material/sort';
import { ServiceGroupAddEditDialogComponent } from '../service-group-add-edit-dialog/service-group-add-edit-dialog.component';
import { LOAI_SAN_PHAM } from '../../../constants/config';

@Component({
  selector: 'service-group-list',
  templateUrl: './service-group-list.component.html',
  styleUrls: ['./service-group-list.component.css'],
})
export class ServiceGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm dịch vụ";
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
      typeGroupProduct: [LOAI_SAN_PHAM.DICH_VU]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }
  @ViewChild(MatSort) sort?: MatSort;
  async openAddEditDialog(serviceGroupID: any) {
    const dialogRef = this.dialog.open(ServiceGroupAddEditDialogComponent, {
      data: serviceGroupID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}