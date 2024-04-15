import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { MatSort } from '@angular/material/sort';
import { SupplierAddEditDialogComponent } from '../supplier-add-edit-dialog/supplier-add-edit-dialog.component';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
})
export class SupplierListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách nhà cung cấp";
  displayedColumns = [
    '#',
    'code',
    'tenNhaCungCap',
    'tenNhomNhaCungCap',
    'diaChi',
    'soDienThoai',
    'barcode',
    'action'
  ];
  isDeleted : boolean = false;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhaCungCapService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: '',
      dataDelete: [false]
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  async openAddEditDialog(supplierID: any) {
    const dialogRef = this.dialog.open(SupplierAddEditDialogComponent, {
      data: supplierID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}