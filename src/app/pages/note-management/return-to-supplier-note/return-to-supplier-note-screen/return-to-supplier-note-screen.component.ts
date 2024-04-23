import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { STATUS_API } from '../../../../constants/message';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { NhaCungCapService } from '../../../../services/categories/nha-cung-cap.service';
import { ThuocService } from '../../../../services/products/thuoc.service';
import { LOAI_PHIEU, LOAI_SAN_PHAM } from '../../../../constants/config';

@Component({
  selector: 'return-to-supplier-note-screen',
  templateUrl: './return-to-supplier-note-screen.component.html',
  styleUrls: ['./return-to-supplier-note-screen.component.css'],
})
export class ReturnToSupplierNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu trả lại hàng trả cung cấp";
  
  listNhaCungCaps : any[] = [];
  listThuocs : any[] = [];
  maPhieuXuat : number = 0;
  phieuXuat: any = {};
  chiTietPhieus : any[] = [
    {
    thuocId : 0
  },
]
  displayedColumns = [
    '#',
    'stt',
    'anh',
    'matHang',
    'donVi',
    'soLuong',
    'donGia',
    'ck',
    'vat',
    'ton',
    'thanhTien'
  ];
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private nhaCungCapService: NhaCungCapService,
    private thuocService: ThuocService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      nhaCungCapMaNhaCungCap: [0],
      loaiXuatNhapMaLoaiXuatNhap: [LOAI_PHIEU.PHIEU_XUAT_VE_NCC],
      ngayXuat: [],
      soPhieuXuat : [0]
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.dataTable.push({thuocId : 0});
    if(this.maPhieuXuat == 0){
      let body = {
        maLoaiXuatNhap : 4,
        id : null
      }
      this.service.init(body).then((res)=>{
        if(res && res.data){
          console.log(res);
          const data = res.data;
          this.formData.patchValue({
            ngayXuat : data.ngayXuat,
            soPhieuXuat : data.soPhieXuat
          });
        }
      });
    }
  }

  getMaNhaThuoc(){
    return this.authService.getNhaThuoc().maNhaThuoc;
  }
  async searchPageNhaCungCap($event: any) {
    if ($event.term.length >= 2) {
      let body = { textSearch : $event.term,  paggingReq: {}, dataDelete : false};
        body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      this.nhaCungCapService.searchFilterPageNhaCungCap(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listNhaCungCaps = res.data.content;
        }
      });
    }
  }
  
  async searchPageDrug($event: any) {
    if ($event.term.length >= 2) {
      let body = { textSearch : $event.term,  paggingReq: {}, dataDelete : false, 
        nhaThuocMaNhaThuoc : this.getMaNhaThuoc(), typeService : LOAI_SAN_PHAM.THUOC
      };
        body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      this.thuocService.searchPage(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listThuocs = res.data.content;
        }
      });
    }
  }

  async onDrugChange($event: any){
    if($event && $event.id > 0){
      var item = $event;
      item.thuocId = item.id;
      item.giaBan = item.heSo > 1 ? item.giaNhap * item.heSo : item.giaNhap;
      item.soLuong = 1;
      item.donViChon = item.heSo > 1 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
      item.donViTinhs = [{maDonViTinh : item.donViXuatLeMaDonViTinh, tenDonViTinh : item.tenDonViTinhXuatLe}];
      if(item.heSo > 1){
        item.donViTinhs.push({maDonViTinh : item.donViThuNguyenMaDonViTinh, tenDonViTinh : item.tenDonViTinhThuNguyen});
      }

      this.dataTable.push(item);
      console.log(this.chiTietPhieus);
    }
  }
}