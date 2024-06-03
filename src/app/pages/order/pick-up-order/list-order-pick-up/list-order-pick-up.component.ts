import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PickUpOrderService} from "../../../../services/order/pick-up-order.service";
import {UserProfileService} from "../../../../services/system/user-profile.service";
import {reduce} from "rxjs";

@Component({
  selector: 'app-list-order-pick-up',
  templateUrl: './list-order-pick-up.component.html',
  styleUrl: './list-order-pick-up.component.css'
})
export class ListOrderPickUpComponent extends BaseComponent implements OnInit {
  title: string = "Tra cứu đơn nhặt";
  listUserProfile : any[]=[];

  listStatus :any[] = [
    {
      key : 1,
      value : 'Đơn nhặt tạo mới'
    },
    {
      key : 102,
      value : 'Đơn nhặt đã cập nhật'
    },
    {
      key : 40,
      value : 'Đơn nhặt đã xử lý'
    },
  ]

  listOptSearch :any[] = [
    {
      key : 1,
      value : 'Mã sản phẩm'
    },
    {
      key : 2,
      value : 'Mã số đơn'
    },
    {
      key : 3,
      value : 'Nhân viên'
    },
    {
      key : 4,
      value : 'Diễn giải'
    },
  ]

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : PickUpOrderService,
    private userProfileService : UserProfileService
  ) {
    super(injector, _service);
    this.getListUserProfle();
    this.formData = this.fb.group({
      orderStatusId : [],
      optionSearch : [1],
      drugIds : [],
      orderNumber : [],
      createdByUserId : [],
      description : []
    })
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.searchPage();
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

  onChangeOptSr($event){
    console.log($event)
  }

  getTotalByStatus(orderStatusId){
    let filter = this.dataTable.filter(item => item.orderStatusId == orderStatusId)
    if(filter){
      return filter.length;
    }else{
      return 0;
    }
  }

  getTongTien(){
    return this.dataTable.reduce((prev, cur) => {
      prev += cur.totalAmount;
      return prev;
    }, 0);
  }

}

