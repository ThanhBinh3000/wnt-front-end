import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatDialog} from "@angular/material/dialog";
import {
  CustomerGroupAddEditDialogComponent
} from "../customer-group-add-edit-dialog/customer-group-add-edit-dialog.component";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'customer-group-list',
  templateUrl: './customer-group-list.component.html',
  styleUrls: ['./customer-group-list.component.css'],
})
export class CustomerGroupListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách nhóm khách hàng";
  displayedColumns = ['#', 'tenNhomKhachHang', 'ghiChu', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhomKhachHangService,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenNhomKhachHang: '',
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

  async openAddEditDialog(customerGroupID: any) {
    const dialogRef = this.dialog.open(CustomerGroupAddEditDialogComponent, {
      data: customerGroupID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
