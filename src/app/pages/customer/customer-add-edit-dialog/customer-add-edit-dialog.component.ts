import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { NhomKhachHangService } from '../../../services/categories/nhom-khach-hang.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'customer-add-edit-dialog',
  templateUrl: './customer-add-edit-dialog.component.html',
  styleUrls: ['./customer-add-edit-dialog.component.css'],
})
export class CustomerAddEditDialogComponent extends BaseComponent implements OnInit {
  oldNumber :number = 0;
  @Input() isMinimized: boolean = false;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  listNhomKhachHang : any[] = [];
  constructor(
    injector: Injector,
    private _service: KhachHangService,
    private nhomKhachHangService : NhomKhachHangService,
    public dialogRef: MatDialogRef<CustomerAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customerID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      tenKhachHang: ['', Validators.required],
      code: [''],
      soDienThoai: [''],
      diaChi : [''],
      sexId: [''],
      noDauKy: [0],
      barCode: [''],
      maNhomKhachHang : ['', Validators.required],
      birthDate :[''],
      email : ['', Validators.email],
      donViCongTac : [''],
      cusType : [null],
      phoneContacter : [''],
      nameContacter : [''],
      refCus : [''],
      ghiChu : [''],
      nationalFacilityCode : [''],
      medicalIdentifier : [''],
      citizenIdentification : [''],
      healthInsuranceNumber : [''],
      job : [''],
      abilityToPay : [''],
      taxCode : [''],
      maNhaThuoc :[''],
      storeId : [0],
      created : [],
      createdByUserId : [],
      totalScore : [0],
      zaloId : [''],
      cityId : [0],
      regionId : [0],
      referenceId : [0],
      archivedId : [0],
      initScore : [0],
      score : [0],
      active : [false],
      recordStatusId : [0],
      mappingStoreId : [0],
      preMetadataHash : [0],
      metadataHash : [0],
      masterId : [0],
      wardId : [0]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.customerID) {
      const data = await this.detail(this.customerID);
      if (data) {
        this.formData.patchValue(data);
      }
      
    }
  }
  getDataFilter(){
    // Nhóm khách hàng
    this.nhomKhachHangService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listNhomKhachHang = res.data;
        this.listNhomKhachHang.unshift({id: '', tenNhomKhachHang : 'Chọn nhóm khách hàng'});
      }
    });
  }
  async saveEdit() {
    let body = this.formData.value;
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
}

function Big(arg0: number): any {
  throw new Error('Function not implemented.');
}
