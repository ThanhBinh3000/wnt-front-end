import { Component, ElementRef, HostListener, Injector, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { DatePipe } from '@angular/common';
import { LOAI_PHIEU, LOAI_SAN_PHAM, RECORD_STATUS } from '../../../../constants/config';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { DonViTinhService } from '../../../../services/products/don-vi-tinh.service';
import { ThuocService } from '../../../../services/products/thuoc.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { NhaThuocsService } from '../../../../services/system/nha-thuocs.service';
import { SETTING } from '../../../../constants/setting';
import { DrugUpdateBatchDialogComponent } from '../../../drug/drug-update-batch-dialog/drug-update-batch-dialog.component';
import moment from 'moment';

@Component({
  selector: 'warehouse-transfer-note-screen',
  templateUrl: './warehouse-transfer-note-screen.component.html',
  styleUrls: ['./warehouse-transfer-note-screen.component.css'],
})
export class WarehouseTransferNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu chuyển kho";
  listThuoc: any[] = [];
  listNhaThuoc: any[] = [];
  // Settings
  discountByValue = {
    activated: this.authService.getSettingActivated(SETTING.DELIVERY_NOTE_DISCOUNT_BY_VALUE),
  };
  displayImage = {
    activated: this.authService.getSettingActivated(SETTING.UPDATE_IMAGES_FOR_PRODUCTS),
  };

  displayedColumns = this.getDisplayedColumns();

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private thuocService: ThuocService,
    private donViTinhService: DonViTinhService,
    private nhaThuocsService: NhaThuocsService,
    private datePipe: DatePipe
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      soPhieuXuat: [],
      ngayXuat: [],
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_CHUYEN_KHO,
      tongTien: [0],
      dienGiai: '',
      noteDate: [],
      storeId: [0],
      targetStoreId: [],
      createdByUserText: [],
      created: [],
      //trường không dùng
      backPaymentAmount: [0],
      connectivityStatusID: [0],
      daTra: [0],
      discount: [0],
      paymentScore: [0],
      vat: [0],
    })
  }

  getDisplayedColumns() {
    var val = ['#', 'stt', 'image', 'ten', 'donVi', 'soLuong', 'donGia', 'giaXuat', 'chietKhau', 'vat', 'loHan', 'ton', 'thanhTien'];
    if (!this.displayImage.activated) {
      val = val.filter(e => e !== 'image');
    }
    return val;
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.dataTable.push({ isEditing: true });
    this.getId();
    console.log(this.idUrl);
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      data.chiTiets.forEach(item => {
        item.isEditing = false;
        item.listDonViTinhs = item.thuocs.listDonViTinhs;
        item.tenThuoc = item.thuocs.tenThuoc;
        item.maThuoc = item.thuocs.maThuoc;
        item.tonHT = item.thuocs.inventory ? item.thuocs.inventory.lastValue : 0;
        item.ton = item.tonHT;
        if (item.heSo > 1) {
          item.tonHT = item.ton / item.heSo;
        }
      });
      this.dataTable.push(...data.chiTiets);
    }
    else {
      let body = {
        maLoaiXuatNhap: LOAI_PHIEU.PHIEU_CHUYEN_KHO,
        id: null
      }
      this.service.init(body).then((res) => {
        console.log(res)
        if (res && res.data) {
          const data = res.data;
          this.formData.patchValue({
            ngayXuat: data.ngayXuat,
            soPhieuXuat: data.soPhieuXuat
          })
        }
      });
    }
  }

  ngAfterViewInit() {
    this.getDataFilter();
    this.focusSearchDrug();
  }

  getDataFilter() {
    //get list nhà thuốc
    this.nhaThuocsService.searchList({
      maNhaThuocCha: this.authService.getNhaThuoc().maNhaThuoc,
      hoatDong: true
    }).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listNhaThuoc = res.data;
        this.formData.patchValue({targetStoreId: this.listNhaThuoc[0].id});
      }
    });
  }

  searchListThuoc($event: any) {
    if ($event.target.value) {
      let body = {
        searchText: $event.target.value,
        nhaThuocMaNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
        recordStatusId: RECORD_STATUS.ACTIVE,
        typeService: LOAI_SAN_PHAM.THUOC,
        paggingReq: {
          limit: 25,
          page: 0
        }
      };
      this.thuocService.searchPage(body).then((res) => {
        if (res && res.data) {
          this.listThuoc = res.data.content;
        }
      })
    }
  }

  onChangeThuoc($event: any) {
    this.thuocService.getDetail($event).then((res) => {
      if (res && res.data) {
        const data = res.data;
        console.log(data);
        this.dataTable[0].thuocThuocId = data.id;
        this.dataTable[0].maThuoc = data.maThuoc;
        this.dataTable[0].tenThuoc = data.tenThuoc;
        this.dataTable[0].soLuong = 1;
        this.dataTable[0].giaNhap = data.giaNhap;
        this.dataTable[0].giaXuat = data.giaNhap;
        this.dataTable[0].donViTinhMaDonViTinh = data.listDonViTinhs[0].id;
        this.dataTable[0].listDonViTinhs = data.listDonViTinhs;
        this.dataTable[0].heSo = data.heSo;
        this.dataTable[0].isModified = false;
        this.dataTable[0].isProdRef = false;
        this.dataTable[0].recordStatusId = 0;
        this.dataTable[0].referenceId = 0;
        this.dataTable[0].retailPrice = 0;
        this.dataTable[0].retailQuantity = 0;
        this.dataTable[0].chietKhau = 0;
        this.dataTable[0].vat = 0;
        this.dataTable[0].batchNumber = '';
        this.dataTable[0].expiredDate = '';
        this.dataTable[0].storeId = 0;
        this.dataTable[0].outOwnerPriceChild = data.outOwnerPriceChild;
        this.dataTable[0].tonHT = data.inventory ? data.inventory.lastValue : 0;
        this.dataTable[0].ton = this.dataTable[0].tonHT;
        if (data.heSo > 1) {
          this.dataTable[0].tonHT = this.dataTable[0].ton / data.heSo;
        }
        //trường không dùng
        this.dataTable[0].connectivityStatusId = 0;
        this.getItemAmount(this.dataTable[0]);
        this.focusInputSoLuong();
      }
    })
  }

  async onAddNew(item: any) {
    //kiểm tra hàng âm kho
    // if (item.ton <= 0) {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.ALLOW_DELIVERY_OVER_QUANTITY);
    //   return;
    // }
    //kiểm tra đã có thuốc chưa
    if (!item.thuocThuocId) {
      this.notification.error(MESSAGE.ERROR, "Hãy chọn thuốc thêm vào phiếu");
      return;
    }
    if (item.isEditing) {
      let isExsit = false;
      this.dataTable.filter(x => !x.isEditing).forEach(x => {
        if (x.thuocThuocId == item.thuocThuocId && x.donViTinhMaDonViTinh == item.donViTinhMaDonViTinh && x.giaXuat == item.giaXuat) {
          //cong so luong
          x.soLuong = x.soLuong + item.soLuong;
          isExsit = true;
        }
      });
      if (!isExsit) {
        item.isEditing = false;
        item.itemOrder = this.dataTable.filter(x => !x.isEditing).length;
        this.dataTable.push(item);
      }
      this.dataTable[0] = { isEditing: true };
      this.updateTotal();
      setTimeout(() => this.focusSearchDrug(), 100);
    }
  }

  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  async focusSearchDrug() {
    this.selectDrug?.focus();
  }

  @ViewChildren('inputSoLuong') inputSoLuongs!: QueryList<ElementRef>;
  async focusInputSoLuong() {
    if (this.inputSoLuongs.last) {
      this.inputSoLuongs.last.nativeElement.focus();
    }
  }

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaXuat = item.giaNhap;
    } else {
      item.giaXuat = item.giaNhap * item.heSo;
    }
    this.getItemAmount(item);
    this.updateTotal();
  }

  async updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditing)
      .reduce((acc, val) => acc += (val.tongTien), 0));
    this.formData.controls['daTra'].setValue(this.dataTable.filter(x => !x.isEditing)
      .reduce((acc, val) => acc += (val.tongTien), 0));
  }

  async getItemAmount(item: any) {
    let discount = this.discountByValue.activated ? (item.giaXuat > 0.05 ? (item.chietKhau / item.giaXuat) : 0) * 100 : item.chietKhau;
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaXuat * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
    item.retailQuantity = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.soLuong : item.soLuong * item.heSo;
    item.retailPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaXuat : item.giaXuat / item.heSo;
    this.updateTotal();
  }

  onDelete(data: any) {
    var index = this.dataTable.indexOf(data);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
      let order = 1;
      this.dataTable.filter(x => !x.isEditing).forEach(x => {
        x.itemOrder = order;
        order++;
      });
    }
    this.updateTotal();
  }

  @ViewChildren('pickerNgayXuat') pickerNgayXuat!: Date;
  async onDateChange(date: Date) {
    let noteDate = this.formData.get('noteDate')?.value;
    this.formData.patchValue({ ngayXuat: this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }

  createUpdate() {
    if (this.formData?.value?.targetStoreId == null || this.formData?.value?.targetStoreId == 0) {
      this.notification.error(MESSAGE.ERROR, 'Hãy chọn nhà thuốc muốn chuyển kho tới.');
      return;
    }
    if (this.dataTable.filter(x => x.thuocThuocId > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    this.updateTotal();
    let body = this.formData.value;
    body.chiTiets = this.dataTable.filter(x => x.thuocThuocId > 0);
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/note-management/warehouse-transfer-note-detail', res.id]);
      }
    });
  }

  getBatchExpiryCss(item: any) {
    if ((item.expiredDate != null && item.expiredDate != '') || (item.batchNumber != null && item.batchNumber != '')) return 'btn-success';

    return 'btn-primary';
  }

  async onLockNote() {

  }

  getBatchNumberAndExpDate(item: any) {
    if (!item) return '';

    var retVal = '';
    if (item.expiredDate != null && item.expiredDate.length > 0) {
      retVal = moment(item.expiredDate).format('DD/MM/YYYY');
    }
    if (item.batchNumber != null && item.batchNumber.length > 0) {
      if (retVal.length == 0) {
        retVal = item.batchNumber;
      } else {
        retVal = retVal.concat("\n(", item.batchNumber, ")");
      }
    }

    return retVal;
};

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F9') {
      event.preventDefault();
      this.createUpdate();
    }
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  openUpdateBatchDialog(drug: any) {
    if(drug.thuocThuocId > 0){
      drug.isShowUsage = true;
      const dialogRef = this.dialog.open(DrugUpdateBatchDialogComponent, {
        data: drug,
        width: '600px',
      });
    }
    else{
      this.notification.error(MESSAGE.ERROR, 'Hãy chọn thuốc muốn cập nhật số lô/hạn dùng.');
    }
  }
}