import {Component, Injector, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {BaseComponent} from "../../../component/base/base.component";
import {PickUpOrderService} from "../../../services/order/pick-up-order.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";

@Component({
  selector: 'app-list-order-assign',
  templateUrl: './list-order-assign.component.html',
  styleUrl: './list-order-assign.component.css'
})
export class ListOrderAssignComponent extends BaseComponent implements OnInit {
  title: string = "Gán nhân viên đơn nhặt";

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PickUpOrderService,
  ) {
    super(injector, _service);

    this.formData = this.fb.group({
      fromDate : [],
      toDate : []
    })
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  assginStaff($event,item){
    let body = {
      id : item.id,
      staffUserId : $event
    }
    this._service.assignStaff(body).then(res=>{
      if (res?.status == STATUS_API.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, "Gắn nhân viên thành công");
      }
    })
  }

  async searchPageAssignStaff() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      if(this.filterType == 1){
        body.fromDate = this.fromDate;
        body.toDate = this.toDate;
      }
      let res = await this._service.searchPageAssignStaff(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        this.totalPages = data.totalPages;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
  }

}
