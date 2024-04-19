import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { NhanVienNhaThuocsService } from '../../../services/system/nhan-vien-nha-thuocs.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { MatSort } from '@angular/material/sort';
import { ThuChiService } from '../../../services/categories/thu-chi.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './in-out-note-list.component.html',
  styleUrls: ['./in-out-note-list.component.css'],
})
export class InOutNoteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tra cứu phiếu thu chi";
  tongTien : number = 0;
  displayedColumns = [
    '#',
    'soPhieu',
    'nguoiNhan',
    'ngayTao',
    'createBy_UserName',
    'amount',
    'dienGiai',
    'httt',
    'action'
  ];
  listNhanVien: any[] = [];
  listNhaCungCap: any[] = [];
  listKhachHang: any[] = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuChiService,
    private nhanVienService : NhanVienNhaThuocsService,
    private khachHangService : KhachHangService,
    private nhaCungCapService : NhaCungCapService,
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      soPhieu: '',
      loaiPhieu: [1],
      khachHangMaKhachHang: '',
      nhaCungCapMaNhaCungCap: '',
      createdBy_UserId : '',
      fromDate : '',
      toDate : ''
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    if(this.dataTable){
       this.tongTien = this.dataTable.reduce((acc, val) => acc += val.amount, 0);
    }
    this.getDataFilter();
  }
  
  //get data
  getDataFilter() {
    // Nhóm khách hàng
    this.nhanVienService.searchList({}).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        console.log(res.data);
        this.listNhanVien = res.data;
        this.listNhanVien.unshift({ id: '', tenDayDu: 'Tất cả' });
      }
    });
  }
}