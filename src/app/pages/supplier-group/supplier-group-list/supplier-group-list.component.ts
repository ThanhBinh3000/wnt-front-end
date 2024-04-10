import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NhomNhaCungCapService } from '../../../services/categories/nhom-nha-cung-cap.service';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { SupplierGroupAddEditDialogComponent }
from '../supplier-group-add-edit-dialog/supplier-group-add-edit-dialog.component';

@Component({
  selector: 'supplier-group-list',
  templateUrl: './supplier-group-list.component.html',
  styleUrls: ['./supplier-group-list.component.css'],
})
export class SupplierGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm nhà cung cấp";
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhomNhaCungCapService,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenNhomNhaCungCap: '',
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }

  async openAddEditDialog(supplierGroupID: any) {
    console.log('open');
    const dialogRef = this.dialog.open(SupplierGroupAddEditDialogComponent, {
      data: supplierGroupID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
