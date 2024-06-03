import {Component, Injector, OnInit} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {Title} from "@angular/platform-browser";
import {PickUpOrderDetailService} from "../../../services/order/pick-up-order-detail.service";
import {DrugToBuysService} from "../../../services/order/drug-to-buys.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {LOAI_SAN_PHAM} from "../../../constants/config";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {BaseComponent} from "../../../component/base/base.component";

@Component({
  selector: 'app-confirm-delivery',
  templateUrl: './confirm-delivery.component.html',
  styleUrl: './confirm-delivery.component.css'
})
export class ConfirmDeliveryComponent extends BaseComponent implements OnInit  {
  title: string = "Xác nhận hàng giao trong ngày";
  listUserProfile : any[]=[];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PickUpOrderDetailService,
    private drugToBuysService: DrugToBuysService,
    private userProfileService :  UserProfileService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      staffUserId : [],
      fromDate : [],
      toDate : [],
    })
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.search();
    this.getListUserProfle();
    this.userInfo = this.authService.getUser();
  }


  async search() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      // if(this.filterType == 1){
      //   body.fromDate = this.fromDate;
      //   body.toDate = this.toDate;
      // }
      let res = await this._service.searchPageConfirmDelivery(body);
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


  getListUserProfle(){
    let body = {
      hoatDong : true,
      maNhaThuoc :  this.authService.getNhaThuoc().maNhaThuoc
    }
    this.userProfileService.searchList(body).then(res=>{
      if(res?.data){
        this.listUserProfile = res.data;
      }
    })
  }

  cancelDrugBuy(item){
    console.log(item)
    let body =  {
      id : item.drugToBuys?.id,
      drugId : item.thuocs.id,
      unitId : item.unitId,
      pickUpOrderDetailId : item.id
    }
    this.drugToBuysService.cancelDrugBuy(body).then((res)=>{
      if(res?.status == STATUS_API.SUCCESS){
        this.notification.success(MESSAGE.SUCCESS,"Hủy thành công");
        this.searchPage();
      }
    })
  }

  restoreDrugBuy(item){
    console.log(item)
    let body =  {
      id : item.drugToBuys?.id
    }
    this.drugToBuysService.restoreDrugBuy(body).then((res)=>{
      if(res?.status == STATUS_API.SUCCESS){
        this.notification.success(MESSAGE.SUCCESS,"Khôi phục thành công");
        this.searchPage();
      }
    })
  }

  completeDrugToBuy(item){
    console.log(item)
    let body =  {
      id : item.drugToBuys?.id,
      inPrice : item.drugToBuys?.inPrice,
      quantity : item.drugToBuys?.quantity,
      description : item.drugToBuys?.description
    }
    this.drugToBuysService.completeDrugBuy(body).then((res)=>{
      if(res?.status == STATUS_API.SUCCESS){
        this.notification.success(MESSAGE.SUCCESS,"Hoàn thành mua thuốc thành công");
        this.searchPage();
      }
    })
  }

  getTotalMoney(column){
    return this.dataTable.reduce((prev, cur) => {
      if(column == 'receipt'){
        prev += (cur.inPrice * cur.receiptQuantity);
        return prev;
      }
      if(column == 'delivery'){
        prev += (cur.inPrice * cur.deliveryQuantity);
        return prev;
      }
    }, 0);
  }
}
