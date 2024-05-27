import { Component, Injector, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { InventoryItemUpdateDialogComponent } from '../inventory-item-update-dialog/inventory-item-update-dialog.component';
import { LOAI_PHIEU } from '../../../constants/config';
import { MESSAGE, STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrl: './inventory-detail.component.css'
})
export class InventoryDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu kiểm kê chi tiết";
  data: any = [];

  displayedColumns = [
    'stt',
    'nhomThuoc',
    'maThuoc',
    'tenThuoc',
    'donVi',
    'slHeThong',
    'slThuc',
    'chenhLech',
    'giaKiemKe',
    'loHan',
    'action'
  ];

  phieuBuNhapXuat: any[] = [
    {
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_NHAP,
      soPhieu: 0,
      soLuongThuoc: 0,
      loaiPhieu: "Phiếu nhập",
      id: 0
    },
    {
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_XUAT,
      soPhieu: 0,
      soLuongThuoc: 0,
      loaiPhieu: "Phiếu xuất",
      id: 0
    }
  ]

  constructor(
    private titleService: Title,
    injector: Injector,
    private _service: PhieuKiemKeService,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if (this.idUrl) {
      this.data = await this.detail(this.idUrl);
      console.log(this.data);
      if (this.data.daCanKho && this.data.phieuXuatNhaps.length > 0) {
        if (this.data.phieuXuatNhaps.length == 2) {
          this.phieuBuNhapXuat = this.data.phieuXuatNhaps;
        } else {
          if (this.data.phieuXuatNhaps.filter((x: any) => x.loaiPhieu == "Phiếu nhập")) {
            this.phieuBuNhapXuat.forEach(x => {
              if (x.maLoaiXuatNhap == LOAI_PHIEU.PHIEU_NHAP) {
                let item = this.data.phieuXuatNhaps.filter((xx: any) => xx.loaiPhieu == "Phiếu nhập")[0];
                x.maLoaiXuatNhap = LOAI_PHIEU.PHIEU_NHAP;
                x.soLuongThuoc = item.soLuongThuoc,
                  x.id = item.id,
                  x.soPhieu = item.soPhieu
              }
            });
          } else {
            this.phieuBuNhapXuat.forEach(x => {
              if (x.maLoaiXuatNhap == LOAI_PHIEU.PHIEU_XUAT) {
                let item = this.data.phieuXuatNhaps.filter((xx: any) => xx.loaiPhieu == "Phiếu xuất")[0];
                x.maLoaiXuatNhap = LOAI_PHIEU.PHIEU_XUAT;
                x.soLuongThuoc = item.soLuongThuoc,
                  x.id = item.id,
                  x.soPhieu = item.soPhieu
              }
            });
          }
        }
      }
      console.log(this.phieuBuNhapXuat);
    }
  }

  async openInventoryItemUpdateDialog(item: any) {
    if (!item.thuocThuocId) return;
    const dialogRef = this.dialog.open(InventoryItemUpdateDialogComponent, {
      data: item,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }

  getRowColor(row: any) {
    return row.thucTe - row.tonKho < 0 ? '#F47DB0' : '';
  }

  getDetail(item: any) {
    var urlDetail = item.maLoaiXuatNhap == LOAI_PHIEU.PHIEU_NHAP
      ? `/management/note-management/receipt-note-detail/${item.id}`
      : `/management/note-management/delivery-note-detail/${item.id}`;
    let baseUrl = window.location.href.replace(this.router.url, '');
    const url = new URL(urlDetail, baseUrl).href;
    window.open(url, '_blank');
  }

  //xoá chi tiết
  xacNhanXoaChiTiet(item: any) {
    let message = this.data.chiTiets.length > 1 ? 'Bạn có chắc chắn muốn xoá thuốc này không ?'
      : 'Trong phiếu chỉ còn 1 thuốc. Bạn có muốn xóa cả phiếu này không?';
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: message,
      okText: 'Đồng ý',
      cancelText: 'Đóng',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this._service.xoaChiTiet({ id: item.id }).then((res) => {
          if (res?.status == STATUS_API.SUCCESS) {
            var index = this.data.chiTiets.indexOf(item);
            if (index >= 0) {
              this.data.chiTiets.splice(index, 1);
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            }else{
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
          }else{
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        });
      }
    });
  }
}
