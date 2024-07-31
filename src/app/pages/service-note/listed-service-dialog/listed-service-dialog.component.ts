import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { MedicalFeeReceiptsService } from '../../../services/medical/medical-fee-receipts.service';
import { PhieuDichVuService } from '../../../services/medical/phieu-dich-vu.service';


@Component({
  selector: 'listed-service-dialog',
  templateUrl: './listed-service-dialog.component.html',
  styleUrls: ['./listed-service-dialog.component.css'],
})
export class ListedServiceDialogComponent extends BaseComponent implements OnInit {
  displayedColumns = ['tenDichVu', 'nhomDichVu', 'trangThai', 'thanhTien', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuDichVuService,
    public dialogRef: MatDialogRef<ListedServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);

  }

  async ngOnInit() {
    console.log(this.data);
    let body = {
      drugStoreID: this.getMaNhaThuoc(),
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1
      }
    }
    let res = await this.service.searchPage(body);
    if (res?.status == STATUS_API.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      this.totalPages = data.totalPages;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
    }
  }


  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
