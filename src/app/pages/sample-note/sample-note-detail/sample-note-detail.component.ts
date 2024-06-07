import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import moment from 'moment';
import { BaseComponent } from '../../../component/base/base.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { DrugDetailDialogComponent } from '../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { CustomerDetailDialogComponent } from '../../customer/customer-detail-dialog/customer-detail-dialog.component';
import { DoctorDetailDialogComponent } from '../../doctor/doctor-detail-dialog/doctor-detail-dialog.component';


@Component({
  selector: 'sample-note-detail',
  templateUrl: './sample-note-detail.component.html',
  styleUrls: ['./sample-note-detail.component.css'],
})
export class SampleNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Thông tin chung đơn/liều mẫu";
  displayedColumns = this.getDisplayedColumns();
  listTypeSample: any[] = [];
  listTypeSample3214: any[] = [];
  listTypeFormOfTreatment: any[] = [];
  data: any = {};

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: SampleNoteService,
    private datePipe: DatePipe,
    private bacSiesService: BacSiesService,
    private khachHangService: KhachHangService,
    private thuocService: ThuocService,
    private diagnoseService: EsDiagnoseService,
  ) {
    super(injector, _service);
  }

  getDisplayedColumns() {
    var val = ['#', 'maThuoc', 'tenThuoc', 'donVi', 'soLuong', 'ghiChu', 'giaBan', 'tongTien'];
    
    return val;
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.getId();
    if(this.idUrl){
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.data = data;
      this.data.diagnoseText = this.data.diagnostics != null ? this.data.diagnostics.map((item: any) => item.tenChanDoan).join(', ') : '';
      this.dataTable = data.chiTiets;
    }
  }

  getDataFilter() {
    // Loại đơn
    this.listTypeSample = [
      { id: "", label: 'Mặc định' },
      { id: "c", label: 'Đơn cơ bản' },
      { id: "h", label: 'Đơn hướng tâm thần' },
      { id: "n", label: 'Đơn thuốc gây nghiện' },
      { id: "y", label: 'Đơn thuốc cổ truyền' }
    ];
    this.listTypeSample3214 = [
      { id: 0, label: 'Đơn thuốc' },
      { id: 1, label: 'Đơn tư vấn' },
    ];
    // Hình thức điều trị
    this.listTypeFormOfTreatment = [
      { id: 0, label: 'Mặc định' },
      { id: 1, label: 'Nội trú' },
      { id: 2, label: 'Ngoại trú' },
    ];
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  getTotalAmount() {
    return this.dataTable.reduce((acc, item) => acc + this.getItemAmount(item), 0);
  }

  getItemPrice(data: any) {
    var price = data.thuocs.giaBanLe;
    var unitId = parseInt(data.drugUnitID);
    if (unitId !== data.thuocs.donViXuatLeMaDonViTinh) {
      price *= data.thuocs.heSo;
    }
    return price;
  }

  getItemAmount(data: any) {
    var price = this.getItemPrice(data);
    return price * data.quantity;
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async openCustomerDetailDialog(customerId: any) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: customerId,
      width: '600px',
    });
  }

  async openDoctorDetailDialog(doctorId: any) {
    this.dialog.open(DoctorDetailDialogComponent, {
      data: doctorId,
      width: '600px',
    });
  }
}
