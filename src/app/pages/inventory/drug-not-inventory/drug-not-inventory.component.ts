import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { DATE_RANGE, STATUS_CODE } from '../../../constants/config';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-drug-not-inventory',
  templateUrl: './drug-not-inventory.component.html',
  styleUrl: './drug-not-inventory.component.css'
})
export class DrugNotInventoryComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách thuốc chưa kiểm kê";

  displayedColumns = [
    'stt',
    'nhomThuoc',
    'maThuoc',
    'tenThuoc',
    'donVi',
    'action'
  ];


  constructor(
    private titleService: Title,
    private _service: PhieuKiemKeService,
    injector: Injector,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.searchPageThuocChuaKiemKe();
  }

  searchPageThuocChuaKiemKe(){
    let body = {
      fromDate : this.fromDate,
      toDate : this.toDate
    };
    console.log(body);
    this._service.searchPageThuocChuaKiemKe(body).then((res)=>{
      if(res?.status == STATUS_API.SUCCESS){
        this.dataTable = res.data;
      }
    });
  }

  //lưu vào storage
  lapPhieuKiemKe(){
    if(this.dataTable.length > 0){
      this.storageService.set("thuocChuaKiemKe", this.dataTable);
    }
    this.router.navigate(['/management/inventory/add']);
  }

  async onDelete(item: any) {
    var index = this.dataTable.indexOf(item);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
  }

}
