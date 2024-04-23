import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { NhaCungCapService } from '../../../../services/categories/nha-cung-cap.service';
import { STATUS_API } from '../../../../constants/message';

@Component({
  selector: 'return-to-supplier-note-detail',
  templateUrl: './return-to-supplier-note-detail.component.html',
  styleUrls: ['./return-to-supplier-note-detail.component.css'],
})
export class ReturnToSupplierNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "";
  listNhaCungCaps : any[] = [];
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private nhaCungCapService: NhaCungCapService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: '',
      dataDelete: [false],
      cusType: [],
      maNhomKhachHang: ''
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
  async searchObject($event: any) {
    console.log($event.term);
    if ($event.term.length >= 2) {
      let body = { textSearch : $event.term,  paggingReq: {}, dataDelete : false};
        body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      this.nhaCungCapService.searchFilterPageNhaCungCap(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listNhaCungCaps = res.data.content;
        }
      });
    }
  }
}