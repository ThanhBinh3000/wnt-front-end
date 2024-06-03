import {Component, Injector, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {BaseComponent} from "../../../component/base/base.component";
import {PickUpOrderDetailService} from "../../../services/order/pick-up-order-detail.service";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {LOAI_SAN_PHAM} from "../../../constants/config";
import {ThuocService} from "../../../services/products/thuoc.service";
import {DrugToBuysService} from "../../../services/order/drug-to-buys.service";

@Component({
  selector: 'app-list-drug-to-buy',
  templateUrl: './list-drug-to-buy.component.html',
  styleUrl: './list-drug-to-buy.component.css'
})
export class ListDrugToBuyComponent  extends BaseComponent implements OnInit {
  title: string = "Danh sách hàng cần mua";
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  listUserProfile : any[]=[];
  listStatus :any[] = [
    {
      key : 0,
      value : 'Chưa hoàn thành'
    },
    {
      key : 1,
      value : 'Hoàn thành'
    },
    {
      key : 2,
      value : 'Đã hủy'
    },
  ]
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PickUpOrderDetailService,
    private drugToBuysService: DrugToBuysService,
    private userProfileService :  UserProfileService,
    private thuocsService : ThuocService
  ) {
    super(injector, _service);

    this.formData = this.fb.group({
      drugId : [],
      staffUserId : [],
      statusId : [],
      fromDate : [],
      toDate : [],
      orderNumber : []
    })
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.searchPage();
    this.getListUserProfle();
    this.userInfo = this.authService.getUser();
    console.log(this.userInfo)
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

  getDataFilter() {
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
            dataDelete: false,
            maNhaThuoc: this.authService.getNhaThuoc().maNhaThuocCha != '' && this.authService.getNhaThuoc().maNhaThuocCha != null ? this.authService.getNhaThuoc().maNhaThuocCha : this.authService.getNhaThuoc().maNhaThuoc,
            typeService: LOAI_SAN_PHAM.THUOC
          };
          return from(this.thuocsService.searchPage(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data.content;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
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

  getTongTienMat(){
    return this.dataTable.filter(item => item.drugToBuys).reduce((prev, cur) => {
      prev += (cur.drugToBuys.inPrice * cur.drugToBuys.quantity);
      return prev;
    }, 0);
  }

}
