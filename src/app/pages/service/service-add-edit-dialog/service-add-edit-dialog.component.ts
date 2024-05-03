import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { dateValidator } from '../../../validators/date.validator';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { STATUS_API } from '../../../constants/message';
import { PhongKhamsService } from '../../../services/medical/phong-khams.service';

@Component({
  selector: 'service-add-edit-dialog',
  templateUrl: './service-add-edit-dialog.component.html',
  styleUrls: ['./service-add-edit-dialog.component.css'],
})
export class ServiceAddEditDialogComponent extends BaseComponent implements OnInit {

  listNhomDichVu: any[] = []
  listPhongKham: any[] = []
  listTypeResultService: any[] = []

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    private nhomThuocService: NhomThuocService,
    private phongKhamService: PhongKhamsService,
    public dialogRef: MatDialogRef<ServiceAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public serviceId: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      nhomThuocMaNhomThuoc: [0, [Validators.required, Validators.min(1)]],
      maThuoc: ['', [Validators.required, Validators.maxLength(255)]],
      giaNhap: [0],
      tenThuoc: ['', [Validators.required, Validators.maxLength(1024)]],
      giaBanLe: [0],
      contents: [''],
      hangTuVan: [false],
      discount: [],
      idTypeService: [0],
      checkServiceTherapy: [false],
      scorable: [false],
      typeService: [LOAI_SAN_PHAM.DICH_VU],
      countNumbers: [0],
      idClinic: [0],
      thongTin: [],
      resultService: [],
      titleResultService: [''],
      typeResultService: [0],
      isServiceCombo: [false]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.serviceId) {
      const data = await this.detail(this.serviceId);
      this.formData.patchValue(data);
      this.formData.patchValue({checkServiceTherapy: data.idTypeService == 0 ? false : true});
    }
  }

  getDataFilter() {
    // Nhóm thuốc
    this.nhomThuocService.searchList({typeGroupProduct: LOAI_SAN_PHAM.THUOC}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomDichVu = res.data
      }
    });
    // Phòng khám
    this.phongKhamService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPhongKham = res.data
      }
    });
    //Loại phiếu
    this.listTypeResultService = [
      {
        id: 0,
        name: "Mặc định"
      },
      {
        id: 1,
        name: "Siêu âm"
      },
      {
        id: 2,
        name: "XQuang"
      }
    ]
  }

  async createUpdate() {
    let body = this.formData.value;
    //console.log(body);
    let res = await this.save(body);
    if (res) {
      this.dialogRef.close(res);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getFilteredListNhomDichVu(){
    return this.listNhomDichVu.filter(item => item.tenNhomThuoc != 'Nhóm combo');
  }

  onCheckServiceTherapy(){
    var value = this.formData.get('checkServiceTherapy')?.value;
    this.formData.get('idTypeService')?.setValue(value ? 1 : 0);
  }

}
