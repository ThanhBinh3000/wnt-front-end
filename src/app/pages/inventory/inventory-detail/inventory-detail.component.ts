import { Component, Injector, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { InventoryItemUpdateDialogComponent } from '../inventory-item-update-dialog/inventory-item-update-dialog.component';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrl: './inventory-detail.component.css'
})
export class InventoryDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu kiểm kê chi tiết";
  data: any = [];

  displayedColumns = [
    'stt', 
    'nhomThuoc', 
    'maThuoc', 
    'tenThuoc', 
    'donVi', 
    'slHeThong', 
    'slThuc',
    'chenhLech',
    'giaKiemKe',
    'loHan',
    'action'
  ];


  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : PhieuKiemKeService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if(this.idUrl){
      this.data = await this.detail(this.idUrl);
    }
  }

  async openInventoryItemUpdateDialog(item: any) {
    if(!item.thuocThuocId) return;
    const dialogRef = this.dialog.open(InventoryItemUpdateDialogComponent, {
      data: item,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }

  getRowColor(row : any){
      return row.thucTe - row.tonKho < 0 ? '#F47DB0' : '';
  }
}
