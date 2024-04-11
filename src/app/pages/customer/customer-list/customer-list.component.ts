import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from '../../../component/base/base.component';
import { CustomerAddEditDialogComponent } from '../customer-add-edit-dialog/customer-add-edit-dialog.component';
import { NhomKhachHangService } from '../../../services/categories/nhom-khach-hang.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent  extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách khách hàng";
  displayedColumns = [
    '#', 
    'code', 
    'tenKhachHang', 
    'tenNhomKhachHang',
    'soDienThoai',
    'ngaySinh',
    'barcode',
    'created',
    'mappingStoreId',
    'zaloId',
    'action'
];
  listNhomKhachHang : any[] = [];
  listNguoiQuanTamOA : any[] = [];

constructor(
  injector: Injector,
  private titleService: Title,
  private _service: KhachHangService,
  private nhomKhachHangService : NhomKhachHangService,
) {

  super(injector, _service);
  this.formData = this.fb.group({
    textSearch: '',
    dataDelete : [false],
    cusType : [],
    maNhomKhachHang : ''
  });
}

@ViewChild(MatSort) sort?: MatSort;

async ngOnInit() {
  this.titleService.setTitle(this.title);
  await this.searchPage();
  this.getDataFilter();
}
//get data
getDataFilter(){
  // Nhóm khách hàng
  this.nhomKhachHangService.searchList({}).then((res)=>{
    if(res?.statusCode == STATUS_API.SUCCESS){
      this.listNhomKhachHang = res.data;
      this.listNhomKhachHang.unshift({id: '', tenNhomKhachHang : 'Tất cả'});
    }
  });
  this._service.searchListNguoiQuanTamOA().then((res)=>{
    if(res?.statusCode == STATUS_API.SUCCESS){
      this.listNguoiQuanTamOA = res.data;
      this.listNguoiQuanTamOA.unshift({id: '', userName : 'Chọn người quan tâm'});
    }
  });
}
async ngAfterViewInit() {
  this.dataSource.sort = this.sort!;
}

async openAddEditDialog(customerID: any) {
  const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
    data: customerID,
    width: '1000px',
  });
  dialogRef.afterClosed().subscribe(async result => {
    if (result) {
      await this.searchPage();
    }
  });
}
}