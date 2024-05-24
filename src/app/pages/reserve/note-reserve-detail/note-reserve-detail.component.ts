import { Component, Injector, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuDuTruService } from '../../../services/products/phieu-du-tru.service';
import { DrugDetailDialogComponent } from '../../drug/drug-detail-dialog/drug-detail-dialog.component';

@Component({
  selector: 'app-note-reserve-detail',
  templateUrl: './note-reserve-detail.component.html',
  styleUrl: './note-reserve-detail.component.css'
})
export class NoteReserveDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu dự trù";
  displayedColumns = ['#', 'maThuoc', 'tenThuoc', 'donViTon', 'soLuongCanhBao', 'tonKho', 'duTru', 'donViDuTru', 'donGia', 'thanhTien'];
  data: any = {};
  permittedFields: any = {
    drug_ViewInputPrice: true
  };

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuDuTruService,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if(this.idUrl){
      let data = await this.detail(this.idUrl)
      this.data = data;
      this.dataTable = data.chiTiets;
    }
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }
}
