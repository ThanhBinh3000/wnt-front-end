import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { NhanVienNhaThuocsService } from '../../../services/system/nhan-vien-nha-thuocs.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { MatSort } from '@angular/material/sort';
import { ThuChiService } from '../../../services/thu-chi.service';
import { STATUS_API } from '../../../constants/message';
import { UserProfileService } from '../../../services/system/user-profile.service';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './in-out-note-list.component.html',
  styleUrls: ['./in-out-note-list.component.css'],
})
export class InOutNoteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tra cứu phiếu thu chi";
  tongTien: number = 0;
  tienMat: number = 0;
  chuyenKhoan: number = 0;
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
  loaiPhieus: any[] = [
    { id: 1, value: 'Phiếu thu nợ khách hàng' },
    { id: 2, value: 'Phiếu chi trả nhà cung cấp' },
    { id: 3, value: 'Phiếu thu khác' },
    { id: 4, value: 'Phiếu chi khác' },
    { id: 5, value: 'Phiếu chi phí kinh doanh' },
    { id: 6, value: 'Phiếu thu lại nhà cung cấp' },
    { id: 7, value: 'Phiếu chi trả lại khách hàng' },
  ];
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuChiService,
    private nhanVienService: UserProfileService,
    private khachHangService: KhachHangService,
    private nhaCungCapService: NhaCungCapService,
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      soPhieu: '',
      loaiPhieu: [1],
      khachHangMaKhachHang: null,
      nhaCungCapMaNhaCungCap: null,
      createdBy_UserId: '',
      fromDate: '',
      toDate: '',
      nguoiNhan: [null]
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.fetchData();
    this.getDataFilter();
  }
  //tính tổng tiền
  async sumTotalAmount() {
    if (this.dataTable) {
      this.tongTien = this.dataTable.reduce((acc, val) => acc += val.amount, 0);
      this.tienMat = this.dataTable.filter(x => x.paymentTypeId == 0).reduce((acc, val) => acc += val.amount, 0);
      this.chuyenKhoan = this.dataTable.filter(x => x.paymentTypeId == 1).reduce((acc, val) => acc += val.amount, 0);
    }
  }

  async fetchData() {
    await this.searchPage();
    this.sumTotalAmount();
  }

  //get data
  getDataFilter() {
    // Nhóm khách hàng
    this.nhanVienService.searchListStaffManagement({}).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listNhanVien = res.data;
        this.listNhanVien.unshift({ id: '', tenDayDu: 'Tất cả' });
      }
    });
  }
  //tìm kiếm data
  async searchObject($event: any) {
    console.log($event.term);
    if ($event.term.length >= 2) {
      let body = { textSearch : $event.term,  paggingReq: {}, dataDelete : false};
        body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      if(this.formData.get('loaiPhieu')?.value == 1 || this.formData.get('loaiPhieu')?.value == 7){
        this.khachHangService.searchFilterPageKhachHang(body).then((res) => {
          if (res?.statusCode == STATUS_API.SUCCESS) {
            this.listKhachHang = res.data.content;
          }
        });
      }else{
        this.nhaCungCapService.searchFilterPageNhaCungCap(body).then((res) => {
          if (res?.statusCode == STATUS_API.SUCCESS) {
            this.listNhaCungCap = res.data.content;
          }
        });
      }
    }
  }
}