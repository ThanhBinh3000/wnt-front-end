import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {STATUS_API} from "../../../../constants/message";
import {BaseComponent} from "../../../../component/base/base.component";
import {PickUpOrderService} from "../../../../services/order/pick-up-order.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-pick-up-order-detail',
  templateUrl: './pick-up-order-detail.component.html',
  styleUrl: './pick-up-order-detail.component.css'
})
export class PickUpOrderDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu nhặt hàng";

  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : PickUpOrderService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      id : null,
      orderDate : [],
      orderNumber : [],
      createUserName : [],
      totalAmount : [],
      cusName : [],
    })
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if(this.idUrl){
      const res = await this.service.getDetail(this.idUrl);
      if (res?.status == STATUS_API.SUCCESS) {
        const data = res.data;
        this.formData.patchValue(data);
        await this.getDataUpdate(data, data.chiTiets);
      }
    }
  }

  async getDataUpdate(data: any, chiTiets : any[]) {
    debugger
    // this.formData.patchValue(data);
    this.dataTable = chiTiets;
    this.dataTable.filter(x => x.id > 0).forEach(x => {
      x.maThuocText = x.maThuoc;
      x.tenThuocText = x.tenThuoc;
      x.unitList = x.unitList;
      x.tenDonViTinh = x.unitName;
      x.isEditingItem = false
      this.getItemAmount(x);
    });
  }

  async getItemAmount(item: any) {
    item.totalAmount = item.quantity * item.price;
  }
}
