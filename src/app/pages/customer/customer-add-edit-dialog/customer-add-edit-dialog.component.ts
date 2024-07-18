import { Component, Inject, Injector, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { NhomKhachHangService } from '../../../services/categories/nhom-khach-hang.service';
import { STATUS_API } from '../../../constants/message';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'customer-add-edit-dialog',
  templateUrl: './customer-add-edit-dialog.component.html',
  styleUrls: ['./customer-add-edit-dialog.component.css'],
})
export class CustomerAddEditDialogComponent extends BaseComponent implements OnInit {
  oldNumber: number = 0;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  listNhomKhachHang: any[] = [];
  isMinimized : boolean = false;
  isWaitList: boolean = false;

  constructor(
    injector: Injector,
    private _service: KhachHangService,
    private nhomKhachHangService: NhomKhachHangService,
    public dialogRef: MatDialogRef<CustomerAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: any,
    private datePipe: DatePipe
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      tenKhachHang: ['', Validators.required],
      code: [''],
      soDienThoai: [''],
      diaChi: [''],
      sexId: [''],
      noDauKy: [0],
      barCode: [''],
      maNhomKhachHang: ['', Validators.required],
      birthDate: [''],
      email: ['', Validators.email],
      donViCongTac: [''],
      cusType: [null],
      phoneContacter: [''],
      nameContacter: [''],
      refCus: [''],
      ghiChu: [''],
      nationalFacilityCode: [''],
      medicalIdentifier: [''],
      citizenIdentification: [''],
      healthInsuranceNumber: [''],
      job: [''],
      abilityToPay: [''],
      taxCode: [''],
      maNhaThuoc: [''],
      storeId: [0],
      created: [],
      createdByUserId: [],
      totalScore: [0],
      zaloId: [''],
      cityId: [0],
      regionId: [0],
      referenceId: [0],
      archivedId: [0],
      initScore: [0],
      score: [0],
      active: [false],
      recordStatusId: [0],
      mappingStoreId: [0],
      preMetadataHash: [0],
      metadataHash: [0],
      masterId: [0],
      wardId: [0]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    this.isMinimized = this.customer.isMinimized;
    this.isWaitList = this.customer.isWaitList;
    if (this.customer.id > 0) {
      const data = await this.detail(this.customer.id);
      if (data) {
        if (data.birthDate) {
          data.birthDate = new Date(data.birthDate);
        }
        this.formData.patchValue(data);
      }
    }
    if (!this.customer.id) {
      this.genBarcodeCustomer();
    }
  }

  getDataFilter() {
    // Nhóm khách hàng
    this.nhomKhachHangService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomKhachHang = res.data;
        this.listNhomKhachHang.unshift({ id: '', tenNhomKhachHang: 'Chọn nhóm khách hàng' });
      }
    });
  }

  async saveEdit() {
    let body = this.formData.value;
    if (body.birthDate) {
      body.birthDate = this.datePipe.transform(body.birthDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  @ViewChildren('pickerBirthDate') pickerBirthDate!: Date;

  async genBarcodeCustomer() {
    let barcode = "";// this.genBarcode(12);
    this.formData.patchValue({ barCode: (await barcode).valueOf() });
  }
}
