import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';

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
  }

  //lưu vào storage
  lapPhieuKiemKe(){
    this.storageService.set("thuocChuaKiemKe", [{id: 10765959}]);
    this.router.navigate(['/management/inventory/add']);
  }
}
