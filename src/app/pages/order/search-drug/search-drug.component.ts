import {Component, ElementRef, Injector, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {OrdersService} from "../../../services/order/order.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {LOAI_SAN_PHAM, RECORD_STATUS} from "../../../constants/config";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {CreateOrderComponent} from "../create-order/create-order.component";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {NhaCungCapService} from "../../../services/categories/nha-cung-cap.service";

@Component({
  selector: 'app-search-drug',
  templateUrl: './search-drug.component.html',
  styleUrl: './search-drug.component.css'
})
export class SearchDrugComponent extends BaseComponent implements OnInit {
  title: string = "Tra cứu thông tin thuốc & mua hàng";
  @ViewChildren('quantity3') quantityInputs!: QueryList<ElementRef>;
  listNhomThuoc: any[] = []
  listDonViTinh: any[] = []
  quantityOfGoods: any
  listShoppingCart: any[] = [];
  listNhaCungCap: any[] = [];
  searchNhaCungCapTerm$ = new Subject<string>();
  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : OrdersService,
    private donViTinhService : DonViTinhService,
    private nhomThuocService: NhomThuocService,
    private thuocService : ThuocService,
    private nhaCungCapService : NhaCungCapService,
    private userProfileService: UserProfileService,
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      orderStatusId : [],
      searchType : 0,
      drugId : [],
      orderNumber : [],
      customerId : [],
      description : [],
      maNhaCungCap : [],
      nhomThuocMaNhomThuoc : [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.getDataFilter();
    await this.searchPage();
  }


  override async searchPage() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      body.nhaThuocMaNhaThuoc = this.getMaNhaThuoc()
      body.hoatDong = true
      let res = await this.thuocService.searchPage(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.dataTable.forEach(item =>{
          if (item.donViXuatLeMaDonViTinh > 0){
            item.tenDonViTinhXuatLe = this.listDonViTinh.find(i => i.id == item.donViXuatLeMaDonViTinh).tenDonViTinh
          }
        })
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

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async getDataFilter() {
    // Nhóm thuốc
    this.nhomThuocService.searchList({ typeGroupProduct: LOAI_SAN_PHAM.THUOC }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data
      }
    });
    // Đơn vị tính
    this.donViTinhService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listDonViTinh = res.data
      }
    });
    // Nhà cung cấp
    let body = {
      maNhaThuoc : this.authService.getNhaThuoc().maNhaThuoc,
      recordStatusId : RECORD_STATUS.ACTIVE
    };
    this.nhaCungCapService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhaCungCap = res.data;
      }
    })
    // Nhóm thuốc
    let bodyNhomH = {
      maNhaThuoc : this.authService.getNhaThuoc().maNhaThuoc,
      recordStatusId : RECORD_STATUS.ACTIVE
    };
    this.nhomThuocService.searchList(bodyNhomH).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data;
      }
    })
    // Vị trí kho
    // this.warehouseLocationService.searchList({}).then((res) => {
    //   if (res?.status == STATUS_API.SUCCESS) {
    //     this.listWarehouse = res.data
    //   }
    // });
    // Loại thuốc
    // this.productTypesService.searchList({}).then((res) => {
    //   if (res?.status == STATUS_API.SUCCESS) {
    //     this.listProductTypes = res.data;
    //   }
    // });
  }

  onAddShoppingCart(data: any, event: Event){
    const inputElement = event.target as HTMLInputElement;
    if(Number(inputElement.value) > 0){
      data.quantity = Number(inputElement.value);
      data.paymentAmount = data.quantity * data.giaBanLe;
      data.isPickUpGoods = true;
      const index = this.listShoppingCart.findIndex(item => item.id === data.id);
      if (index !== -1) {
        this.listShoppingCart.splice(index, 1);
      }
      this.listShoppingCart.push(data)
      console.log(this.listShoppingCart, "listShoppingCart")
    }
  }

  removeItemOnShoppingCart(data: any){
    this.listShoppingCart = this.listShoppingCart.filter(item => item.id !== data.id);

    this.quantityInputs.forEach((input: ElementRef) => {
      if (input.nativeElement.id === 'quantity' && data.id === +input.nativeElement.dataset.id) {
        input.nativeElement.value = '';
      }
    });

    this.dataTable.find(x => x.id === data.id).quantity = null
    this.dataTable.find(x => x.id === data.id).paymentAmount = null
    this.dataTable.find(x => x.id === data.id).isPickUpGoods = false
    this.dataTable = [...this.dataTable]
    console.log(this.dataTable, "listShoppingCart")
  }

  onResetShoppingCart(){
    this.listShoppingCart.forEach(item => {
      this.quantityInputs.forEach((input: ElementRef) => {
        if (input.nativeElement.id === 'quantity' && item.id === +input.nativeElement.dataset.id) {
          input.nativeElement.value = '';
        }
      });

      this.dataTable.find(x => x.id === item.id).quantity = null
      this.dataTable.find(x => x.id === item.id).paymentAmount = null
      this.dataTable.find(x => x.id === item.id).isPickUpGoods = false
      this.dataTable = [...this.dataTable]
    })
    this.listShoppingCart = []
  }

  override async changePageIndex(event: any) {
    try {
      this.page = event;
      await this.searchPage();
      this.dataTable.forEach(item => {
        const matchedItem = this.listShoppingCart.find(cartItem => cartItem.id === item.id);
        if (matchedItem) {
          item.quantity = matchedItem.quantity;
          item.paymentAmount = matchedItem.paymentAmount;
          item.isPickUpGoods = matchedItem.isPickUpGoods;
        }
      })
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  override async changePageSize(event: any) {
    try {
      this.pageSize = event;
      await this.searchPage();
      this.dataTable.forEach(item => {
        const matchedItem = this.listShoppingCart.find(cartItem => cartItem.id === item.id);
        if (matchedItem) {
          item.quantity = matchedItem.quantity;
          item.paymentAmount = matchedItem.paymentAmount;
          item.isPickUpGoods = matchedItem.isPickUpGoods;
        }
      })
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  navigateToOrderCreate() {
    if(this.listShoppingCart.length > 0){
      sessionStorage.removeItem('dataListShoppingCart'); // Xóa dữ liệu sau khi đã sử dụng
      sessionStorage.setItem('dataListShoppingCart', JSON.stringify(this.listShoppingCart)); // Lưu trữ dữ liệu vào sessionStorage
      this.router.navigate(['/management/order/create-order']);
    }else{
      this.notification.error(MESSAGE.ERROR, "Chưa có mặt hàng nào trong giỏ hàng!");
    }
  }

  async onInShoppingCartChanged(event: Event){
    const isChecked = (<HTMLInputElement>event.target).checked;
    if(isChecked){
      this.dataTable = this.listShoppingCart;
    }else{
      await this.searchPage();
      this.dataTable.forEach(item => {
        const matchedItem = this.listShoppingCart.find(cartItem => cartItem.id === item.id);
        if (matchedItem) {
          item.quantity = matchedItem.quantity;
          item.paymentAmount = matchedItem.paymentAmount;
          item.isPickUpGoods = matchedItem.isPickUpGoods;
        }
      })
    }
  }

}
