import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuXuatService} from "../../../../services/inventory/phieu-xuat.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {LOAI_PHIEU} from "../../../../constants/config";
import {DrugDetailDialogComponent} from "../../../drug/drug-detail-dialog/drug-detail-dialog.component";
import { KhachHangService } from '../../../../services/customer/khach-hang.service';
import { SETTING } from '../../../../constants/setting';

@Component({
  selector: 'delivery-note-detail',
  templateUrl: './delivery-note-detail.component.html',
  styleUrls: ['./delivery-note-detail.component.css'],
})
export class DeliveryNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu bán hàng";
  totalScore: number= 0;
  totalDebtAmount: number=0;
  isContinue = false;
  fromBcScanner= false;
  updateImagesForProducts = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS);
  menuItems: any[] = []

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private khService : KhachHangService,
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      id: null,
      soPhieuXuat: [],
      noteNumber: '',
      noteDate: [],
      khachHangMaKhachHangText: '',
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_XUAT,
      tongTien: [0],
      vat: '',
      daTra: [0],
      dienGiai: '',
      ngayXuat: [],
      chiTiets : [],
      created : [],
      createdByUserText: [],
      bacSyMaBacSyText: [],
      paymentTypeId : [0],
      backPaymentAmount: [0],
      invoiceNo: [''],
      paymentScore: [0],
      discount: [0]
    });
  }

  async ngOnInit() {
    this.getId();
    this.print();
    if (this.idUrl) {
      this.route.data.subscribe((data: any) => {
        this.fromBcScanner = data.fromBcScanner;
      });
      this.route.queryParams.subscribe(params => {
       this.isContinue = params['isContinue'] === 'true';
      });
      let data = await this.detail(this.idUrl)
      if(data.maLoaiXuatNhap == LOAI_PHIEU.PHIEU_KIEM_KE){
        this.title = "Phiếu bù xuất";
        data.khachHangMaKhachHangText = "Điều chỉnh sau kiểm kê";
      }
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
      this.dataTable.forEach(x=>{
        this.getItemAmount(x);
      });
      this.onGetInforCustomer(data.khachHangMaKhachHang);

      this.title = this.idUrl ? this.title + ' #' + this.formData.value?.soPhieuXuat : this.title;
    }
    this.titleService.setTitle(this.title);
  }
  openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }
  async getItemAmount(item: any) {
    let discount = (item.giaXuat > 0.05 ? (item.chietKhau / item.giaXuat) : 0) * 100;
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaXuat * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
  }

  async onLockNote(item: any){
    const res = item.locked ? await this._service.unlock(item) : await this._service.lock(item);
    if (res && res.status == STATUS_API.SUCCESS) {
      item.locked = res.data.locked;
      this.notification.success(MESSAGE.SUCCESS, item.locked ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  //lấy thông tin điểm, nợ khách hàng
  onGetInforCustomer(id : any){
    if(id > 0){
      //điểm tích luỹ
      let bodyKH = {
        id: id,
        maNhaThuoc: this.getMaNhaThuoc()
      }
      this.khService.getPaymentScore(bodyKH).then(res => {
        if(res && res.status == STATUS_API.SUCCESS){
          this.totalScore = res.data;
        }
      });
      //nợ khách hàng
      let bodyPX = {
        khachHangMaKhachHang: id,
        nhaThuocMaNhaThuoc: this.getMaNhaThuoc(),
        ngayTinhNo: this.formData.get('ngayXuat')?.value
      }
      this._service.getTotalDebtAmountCustomer(bodyPX).then(res => {
        if(res && res.status == STATUS_API.SUCCESS){
          this.totalDebtAmount = res.data;
        }
      });
    }
  }

  getDisplayedColumns(){
    let displayedColumns = [
      'stt',
      'anh',
      'maHang',
      'tenHang',
      'donVi',
      'soLuong',
      'donGia',
      'ck',
      'vat',
      'hanDung',
      'thanhTien',

    ];
    if(!this.updateImagesForProducts.activated)
    {
      displayedColumns = displayedColumns.filter(x => x !== 'anh');
    }
    if(this.formData.value?.maLoaiXuatNhap ==  LOAI_PHIEU.PHIEU_KIEM_KE){
      displayedColumns = displayedColumns.filter(x => x !== 'ck' && x !== 'vat' && x !== 'hanDung');
    }
    return displayedColumns;
  }

  getUrlContinue(){
    let url = '/management/note-management/delivery-note-screen';
    if(this.fromBcScanner){
      url = '/management/note-management/delivery-note-barcode-screen';
    }
    return url;
  }

  print(){
    this.menuItems = [
      { loaiIn: '4', label: 'Phiếu khách lẻ - 58mm', condition: true },
      { loaiIn: '3', label: 'Phiếu khách lẻ - 80mm', condition: true },
      { loaiIn: '8', label: 'Phiếu bán buôn - 80mm', condition: this.authService.getMaNhaThuoc() == '13021' },
      { loaiIn: '1', label: 'Phiếu khách quen - A4', condition: true },
      { loaiIn: '6', label: 'Phiếu bán buôn - A4', condition: this.authService.getMaNhaThuoc() == '13021' },
      { loaiIn: '2', label: 'Phiếu khách lẻ - A5', condition: true },
      { loaiIn: '7', label: 'Phiếu bán buôn - A5', condition: this.authService.getMaNhaThuoc() == '13021' },
      { loaiIn: '3', label: 'Phiếu in tên thay thế - 80mm', condition: this.authService.getMaNhaThuoc() != '13462' },
      { loaiIn: '4', label: 'Phiếu cắt liều khách lẻ - 58mm', condition: this.checkNhaThuoc() },
      { loaiIn: '3', label: 'Phiếu cắt liều khách lẻ - 80mm', condition: this.checkNhaThuoc() },
      { loaiIn: '5', label: 'In liều dùng', condition: this.authService.getMaNhaThuoc() != '13462' }
    ];
  }

  checkNhaThuoc() : boolean {
    const allowedNhaThuoc = ['9274', '9275', '9977', '10037', '10038', '10039', '10040', '10041', '10042'];
    return allowedNhaThuoc.includes(this.authService.getMaNhaThuoc());
  }

  protected readonly LOAI_PHIEU = LOAI_PHIEU;
}

