import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { ThuChiService } from '../../../services/thu-chi.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { STATUS_API } from '../../../constants/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-in-out-note',
  templateUrl: './incoming-note-add-edit.component.html',
  styleUrls: ['./incoming-note-add-edit.component.css'],
})
export class InComingNoteAddEditComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU THU";
  inComingNoteID: number = 0;
  loaiPhieu: number = 1;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  listObject : any[] = [];
  listPhieuNo : any[] = [];
  datePipe: any = new DatePipe('en-US');
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuChiService,
    private khachHangService: KhachHangService,
    private nhaCungCapService : NhaCungCapService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      khachHangMaKhachHang : [''],
      phieuXuat : [-1],
      tienNo : [0],
      tienThanhToan : [0]
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
  
  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
  //tìm kiếm data
  async searchObject($event: any) {
    console.log($event.term);
    if ($event.term.length >= 2) {
      let body = { textSearch : $event.term,  paggingReq: {}, dataDelete : false};
        body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      if(this.loaiPhieu == 1 || this.loaiPhieu == 7){
        this.khachHangService.searchFilterPageKhachHang(body).then((res) => {
          if (res?.statusCode == STATUS_API.SUCCESS) {
            this.listObject = res.data.content;
          }
        });
      }else{
        this.nhaCungCapService.searchFilterPageNhaCungCap(body).then((res) => {
          if (res?.statusCode == STATUS_API.SUCCESS) {
            this.listObject = res.data.content;
          }
        });
      }
    }
  }
  async onGetNoteDebt(){
    let id = this.formData.get('khachHangMaKhachHang')?.value;
    if(!id) return;
    let body = { khachHangMaKhachHang : id, maLoaiXuatNhap : 2};
    this._service.searchListPhieuXuat(body).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listPhieuNo = res.data;
        
        this.listPhieuNo = this.listPhieuNo
                         .filter(x => x.tongTien - x.daTra - x.paymentScoreAmount - x.discount - x.debtPaymentAmount > 0);
        this.listPhieuNo.forEach(x=>{
             x.tieuDe = this.datePipe.transform(x.ngayXuat, 'MM/dd/yyyy') + " - " + x.soPhieuXuat;
        });
        this.listPhieuNo.unshift({id: -1, tieuDe : 'Tất cả'});
        let tienNo = this.listPhieuNo.filter(x=>x.id > 0)
        .reduce((acc, x) => acc += x.tongTien - x.daTra - x.paymentScoreAmount - x.discount - x.debtPaymentAmount, 0);
        this.formData.controls['tienNo'].setValue(tienNo);
        this.formData.controls['tienThanhToan'].setValue(tienNo);
        this.formData.controls['phieuXuat'].setValue(-1);
      }
    });
  }
  async onPayFull(){
    this.formData.controls['tienThanhToan'].setValue(this.formData.get('tienNo')?.value);
  }
}