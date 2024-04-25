import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { NhaCungCapService } from '../../../../services/categories/nha-cung-cap.service';
import { STATUS_API } from '../../../../constants/message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'return-to-supplier-note-detail',
  templateUrl: './return-to-supplier-note-detail.component.html',
  styleUrls: ['./return-to-supplier-note-detail.component.css'],
})
export class ReturnToSupplierNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Trả lại hàng nhà cung cấp";
  data: any = {};
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService
  ) {

    super(injector, _service);
  }
  
  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if(this.idUrl)
      {
      this.data = this.detail(this.idUrl);
      }
  }
}