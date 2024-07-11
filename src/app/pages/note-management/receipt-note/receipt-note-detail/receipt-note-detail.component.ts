import {Component, Injector, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';

@Component({
  selector: 'receipt-note-detail',
  templateUrl: './receipt-note-detail.component.html',
  styleUrls: ['./receipt-note-detail.component.css'],
})
export class ReceiptNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu nhập hàng #123";

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : PhieuNhapService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if(this.idUrl){
      this.dataDetail = await this.detail(this.idUrl);
      console.log(this.dataDetail)
      this.dataTable = this.dataDetail.chiTiets;
    }
  }

  calendarTongTien(rowTable?){
    if(rowTable){
      let giaNhap = rowTable.soLuong * rowTable.giaNhap;
      if(rowTable.chietKhau > 0){
        giaNhap = giaNhap * ( ( 100 - rowTable.chietKhau ) / 100 );
      }
      if(rowTable.vat > 0){
        giaNhap = giaNhap + ( giaNhap * (rowTable.vat / 100));
      }
      return giaNhap
    }else{
      return 0;
    }
  }

  calendarRateRevenue(rowItem){
    let rateRevenue = (rowItem.giaBanLe - rowItem.giaNhap) / rowItem.giaNhap * 100 ;
    return Math.round(rateRevenue * 100) / 100;
  }
}
