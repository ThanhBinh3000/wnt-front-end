import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserProfileService} from "../../../../services/system/user-profile.service";
import {NhaThuocsService} from "../../../../services/system/nha-thuocs.service";
import {BaseComponent} from "../../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {STATUS_API} from "../../../../constants/message";
import {TieuChiTrienKhaiService} from "../../../../services/categories/tieu-chi-trien-khai.service";
import {MatDatepicker} from "@angular/material/datepicker";
import {AccountAddEditDialogComponent} from "../../admin/account-add-edit-dialog/account-add-edit-dialog.component";
import {DrugStoreAddEditDialogComponent} from "../drug-store-add-edit-dialog/drug-store-add-edit-dialog.component";
import {TinhThanhsService} from "../../../../services/categories/tinh-thanhs.service";
import {TypeBasisService} from "../../../../services/categories/type-basis.service";

@Component({
  selector: 'drug-store-list',
  templateUrl: './drug-store-list.component.html',
  styleUrl: './drug-store-list.component.css'
})
export class DrugStoreListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tra cứu thông tin nhà thuốc";
  columns = [
    '#', 'maNhaThuoc', 'tenNhaThuoc',
    'diaChi', 'tenTinhThanh', 'dienThoai', 'nguoiDaiDien',
    'createdByUserName', 'created', 'ttGuiTinXNtaoTK', 'connectivityCode',
    'connectivityUserName', 'nameTypeBasis', 'nhanVienKinhDoanh', 'chamSocSauBanHang',
    'ghiChu', 'businessDescription', 'ketQuaTrienKhai', 'tienThanhToan',
    'paidAmount', 'ttThuTien', 'ttGuiTinXNTT', 'kqGuiTinXNTT',
    'paidDate', 'tongNX', 'action'
  ];
  displayedColumns: string[] = this.columns;
  hideColumnList = [
    { name: "Địa chỉ", value: 'diaChi' },
    { name: "Người đại diện", value: 'nguoiDaiDien' },
    { name: "Người tạo", value: 'createdByUserName' },
    { name: "Ngày tạo - Ngày hết hạn", value: 'created' },
    { name: "TK LT", value: 'connectivityUserName' },
    { name: "C.S Bán hàng", value: 'csBanHang' },
    { name: "Ghi chú kinh doanh", value: 'ghiChuKinhDoanh' },
    { name: "Ghi chú triển khai", value: 'ghiChuTrienKhai' },
    { name: "Kết quả triển khai", value: 'ketQuaTrienKhai' },
    { name: "Tổng tiền", value: 'paidAmount' },
    { name: "Ngày thu tiền", value: 'paidDate' }
  ];
  storeTypes = [
    { name: "NT LT", value: 101 },
    { name: "NT QL", value: 102 },
    { name: "Công ty", value: 103 },
    { name: "Phòng khám", value: 104 },
    { name: "Đặt hàng", value: 105 },
    { name: "Nhà tổng đặt hàng", value: 106 },
  ];
  drugStorePaymentTypes = [
    { name: "Chưa thanh toán", value: 0 },
    { name: "Thanh toán chưa đủ", value: 1 },
    { name: "Đã thanh toán", value: 2 }
  ];
  expiredTypes = [
    { name: "Không có hạn", value: 0 },
    { name: "Có hạn", value: 1 },
    { name: "Dưới 30 ngày", value: 2 },
    { name: "Dưới 7 ngày", value: 3 },
    { name: "Đã hết hạn", value: 4 },
  ];
  typeDates = [
    { name: "Ngày tạo cơ sở", value: 1 },
    { name: "Ngày giao dịch", value: 2 },
    { name: "Ngày thu tiền", value: 3 },
    { name: "Ngày tạo cơ sở và thu tiền", value: 4 },
  ];
  znsTypes = [
    { name: "Xác nhận thanh toán", value: 1 },
    { name: "Tạo tài khoản", value: 3 }
  ];
  connectivityTypes = [
    { name: "Đã liên thông", value: 1 },
    { name: "Chưa liên thông", value: 3 }
  ];
  listSuperUser : any[] = [];
  listTieuChiTrienKhai : any[] = [];
  listTinhThanh : any[] = [];
  listTypeBasis: any[] = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhaThuocsService,
    private userProfileService : UserProfileService,
    private tieuChiTrienKhaiService : TieuChiTrienKhaiService,
    private tinhThanhsService : TinhThanhsService,
    private typeBasisService: TypeBasisService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      storeTypeId: [null],
      storeDeployTypeId: [null],
      numDaysNoTrans: [0],
      hoatDong: [true],
      createdByUserId: [null],
      tinhThanhId: [null],
      idTypeBasic: [null],
      storePaymentTypeId: [null],
      expiredType: [null],
      supporterId: [null],
      typeZNS: [null],
      outOfInvoice: [false],
      typeDate: [null],
      connectivityFilterTypeId: [null],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDataFilter(){
    // Danh sách tài khoản quyền hệ thống
    this.userProfileService.searchListUserManagement({roleName: 'SuperUser'}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listSuperUser = res.data;
      }
    });
    // Tiêu chí triển khai
    this.tieuChiTrienKhaiService.searchList({type: 0}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listTieuChiTrienKhai = res.data;
        this.listTieuChiTrienKhai.unshift({ id: 0, name: "Chưa triển khai" });
      }
    });
    // Tỉnh thành
    this.tinhThanhsService.searchList({}).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
    // Chính sách bán hàng
    this.typeBasisService.searchList({}).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listTypeBasis = res.data;
      }
    });
  }

  async onResetSearching() {
    this.formData.reset();
    await this.searchPage();
  }

  onChangeDisplayedColumns(value: any){
    this.displayedColumns = this.columns.filter(col=> !value.map((item: any) => item.value).includes(col));
  }

  @ViewChildren('pickerPaidDate') pickerPaidDate!: QueryList<MatDatepicker<Date>>;

  openDatepicker(rowIndex: number): void {
    const datepicker: MatDatepicker<Date> = this.pickerPaidDate.toArray()[rowIndex];
    if (datepicker) {
      datepicker.open();
    }
  }

  getMessageConfirmPaymentZNS(code: any) {
    let val = "";
    switch (code)
    {
      case -106:
        val = "-106: Phương thức không được hỗ trợ";
        break;
      case -108:
        val = "-108: Số điện thoại không hợp lệ";
        break;
      case -109:
        val = "-109: ID mẫu ZNS không hợp lệ";
        break;
      case -112:
        val = "-112: Nội dung mẫu ZNS không hợp lệ";
        break;
      case -114:
        val = "-114: Người dùng không nhận được ZNS vì các lý do: Trạng thái tài khoản, Tùy chọn nhận ZNS, Sử dụng Zalo phiên bản cũ, hoặc các lỗi nội bộ khác";
        break;
      case -115:
        val = "-115: Tài khoản ZNS không đủ số dư";
        break;
      case -117:
        val = "-117: OA hoặc ứng dụng gửi ZNS chưa được cấp quyền sử dụng mẫu ZNS này";
        break;
      case -118:
        val = "-118: Tài khoản Zalo không tồn tại hoặc đã bị vô hiệu hoá";
        break;
      case -119:
        val = "-119: Tài khoản không thể nhận ZNS";
        break;
      default:
        val = "Gửi thành công";
        break;
    }
    return val;
  }

  async onBusinessChanged($event: any) {

  }

  async onSupporterChanged($event: any) {

  }

  async onUpdateNoteType(item: any) {

  }

  async onUpdateBusinessDescription(item: any) {

  }

  async onResultBusinessChanged(item: any) {

  }

  async onCheckConnectivity(item: any) {

  }

  async onUpdateInfoCustomerPayment(item: any) {

  }

  async openRegionalDetailDialog(item: any) {

  }

  async openGeneralStoreMappingDialog(item: any) {

  }

  async openDrugStoreDetailDialog(item: any) {

  }

  async openAddEditDialog(item: any) {
    const dialogRef = this.dialog.open(DrugStoreAddEditDialogComponent, {
      data: item,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
