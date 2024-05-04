import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from '../../../component/base/base.component';
import { CustomerAddEditDialogComponent } from '../customer-add-edit-dialog/customer-add-edit-dialog.component';
import { NhomKhachHangService } from '../../../services/categories/nhom-khach-hang.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { NhaThuocsService } from '../../../services/system/nha-thuocs.service';
import { RegionInformationEditDialogComponent } from '../../utilities/region-information-edit-dialog/region-information-edit-dialog.component';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent extends BaseComponent implements OnInit, AfterViewInit {
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
  listNhomKhachHang: any[] = [];
  listNguoiQuanTamOA: any[] = [];
  listNhaThuocDongBo: any[] = [];
  count: any = 1;
  isDeleted: boolean = false;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: KhachHangService,
    private nhomKhachHangService: NhomKhachHangService,
    private nhaThuocService: NhaThuocsService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: '',
      dataDelete: [false],
      cusType: [],
      maNhomKhachHang: ''
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    this.getDataFilter();
    this.danhSachNguoiQuanTamOA();
    this.danhSachNhaThuocDonghBoPhieu();
  }
  //get data
  getDataFilter() {
    // Nhóm khách hàng
    this.nhomKhachHangService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomKhachHang = res.data;
        this.listNhomKhachHang.unshift({ id: '', tenNhomKhachHang: 'Tất cả' });
      }
    });
  }
  async danhSachNguoiQuanTamOA(term : any = null) {
    let body: any = {
      paggingReq: {
        limit: this.count * 10,
        page: 0
      },
      textSearch : term
    };

    this._service.searchPageNguoiQuanTamOA(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNguoiQuanTamOA = res.data.content;
        if (res.data.totalElements > res.data.size) {
          this.listNguoiQuanTamOA.push({ id: '', userName: 'Tải thêm' });
          this.count = this.count + 1;
        }
      }
    });
  }
  async updateMappingZaloOA($event: any, customerId: any) {
    if (!$event.id) return;
    let body: any = {
      maKhachHang: customerId,
      zaloId: $event.userId
    };
    this._service.updateMappingZaloOA(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS && res.data > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
      }
    });
  }
  async danhSachNhaThuocDonghBoPhieu(term : any = null) {
    let body: any = {
      paggingReq: {
        limit: this.count * 10,
        page: 0
      },
      textSearch : term
    };

    this.nhaThuocService.searchPageNhaThuocDongBoPhieu(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhaThuocDongBo = res.data.content;
        if (res.data.totalElements > res.data.size) {
          this.listNhaThuocDongBo.push({ id: '', tenNhaThuoc: 'Tải thêm' });
          this.count = this.count + 1;
        }
      }
    });
  }
  async updateMappingStore($event: any, customerId: any) {
    if (!$event.id) return;
    let body: any = {
      maKhachHang: customerId,
      mappingStoreId: $event.id
    };
    this._service.updateMappingMappingStore(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS && res.data > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
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
  async openUpdateRegionInformationDialog(data: any) {
    let object = {
      id: data.id,
      code: data.code,
      name: data.tenKhachHang,
      address: data.diaChi,
      cityId: data.cityId,
      regionId: data.regionId,
      wardId: data.wardId,
      type: 'customer'
    }
    const dialogRef = this.dialog.open(RegionInformationEditDialogComponent, {
      data: object,
      width: '700px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
  //tìm kiếm người quan tâm oa
  async searchFlowerOA($event: any){
    if($event.term.length >= 2){
      this.danhSachNguoiQuanTamOA($event.term);
    }
  }

  async searchStoreMapping($event: any){
    if($event.term.length >= 2){
      this.danhSachNhaThuocDonghBoPhieu($event.term);
    }
  }
}
