import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { SETTING } from '../../../constants/setting';

@Component({
  selector: 'connectivity-sample-note-list',
  templateUrl: './connectivity-sample-note-list.component.html',
  styleUrls: ['./connectivity-sample-note-list.component.css'],
})
export class ConnectivitySampleNoteListComponent extends BaseComponent implements OnInit {
  title: string = "Quản lý đơn thuốc LT";

  displayedColumns = [
    'stt',
    'ngay',
    'maDon',
    'maPhieuKham',
    'tenDon',
    'trangThai',
    'ngayLT',
    'ketQuaLT',
    'maDonQuocGia',
    'loaiDonThuoc',
    'action'];
    
    trangThaiLT = [
      {id: "", value: "Tất cả"},
      {id: 0, value: "Chưa LT"},
      {id: 2, value: "Đã LT"}];

    useSampleNoteFromParent = this.authService.getSettingByKey(SETTING.USE_SAMPLE_NOTE_FROM_PARENT);

  constructor(
    private titleService: Title,
    injector: Injector,
    private _service: SampleNoteService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.useSampleNoteFromParent.activated 
                        ? this.authService.getNhaThuoc().maNhaThuocCha
                        : this.authService.getNhaThuoc().maNhaThuoc,
      isConnect : [true],
      id : [],
      statusConnect : [""],
      fromDateNote: [],
      toDateNote : []
    });

  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    console.log(this.dataTable);
  }

  getLableTrangThai(type : any){
    let value = 'Chưa LT';
    switch(type){
      case 2 :
        value = "Đã LT";
        break;
      case 1 :
        value = "LT lỗi";
        break;
      case 3 :
        value = "Không LT";
        break;
    }
    return value;
  }

  getLableLoaiDon(type : any){
    let value = "";
    switch(type){
      case "c" :
        value = "Đơn thuốc cơ bản";
        break;
      case "y" :
        value = "Đơn thuốc cổ truyền";
        break;
      case "h" :
        value = "Đơn thuốc hướng tâm thần";
        break;
      case "n" :
        value = "Đơn thuốc gây nghiện";
        break;
    }
    return value;
  }

  getRowColor(item : any){
    return item.statusConnect != 2 ? '#F47DB0' : 'none';
  }
}
