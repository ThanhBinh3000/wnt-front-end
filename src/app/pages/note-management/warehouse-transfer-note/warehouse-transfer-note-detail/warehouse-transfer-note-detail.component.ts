import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { LOAI_PHIEU } from '../../../../constants/config';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { SETTING } from '../../../../constants/setting';

@Component({
  selector: 'warehouse-transfer-note-detail',
  templateUrl: './warehouse-transfer-note-detail.component.html',
  styleUrls: ['./warehouse-transfer-note-detail.component.css'],
})
export class WarehouseTransferNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu chuyển kho";
  // Settings
  displayImage = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS);
  displayedColumns = this.getDisplayedColumns();

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
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
      created: [],
      createdByUserText: [],
      targetStoreText: []
    })
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    console.log(this.idUrl);
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
    }
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  getDisplayedColumns() {
    var val = ['#', 'maThuoc', 'image', 'tenThuoc', 'donVi', 'soLuong', 'gia', 'ck', 'loHan', 'thanhTien'];
    if (!this.displayImage.activated) {
      val = val.filter(e => e !== 'image');
    }
    return val;
  }

  protected readonly LOAI_PHIEU = LOAI_PHIEU;
}
