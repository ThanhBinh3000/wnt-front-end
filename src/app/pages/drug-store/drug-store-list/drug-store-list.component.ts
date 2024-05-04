import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserProfileService} from "../../../services/system/user-profile.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {TieuChiTrienKhaiService} from "../../../services/categories/tieu-chi-trien-khai.service";
import {DrugStoreAddEditDialogComponent} from "../drug-store-add-edit-dialog/drug-store-add-edit-dialog.component";
import {TinhThanhsService} from "../../../services/categories/tinh-thanhs.service";
import {DatePipe} from "@angular/common";
import {
  DrugStoreGeneralMappingDialogComponent
} from "../drug-store-general-mapping-dialog/drug-store-general-mapping-dialog.component";
import {TrienKhaiService} from "../../../services/categories/trien-khai.service";
import {TypeBasisService} from "../../../services/categories/type-basis.service";
import {
  RegionInformationEditDialogComponent
} from "../../utilities/region-information-edit-dialog/region-information-edit-dialog.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'drug-store-list',
  templateUrl: './drug-store-list.component.html',
  styleUrl: './drug-store-list.component.css'
})
export class DrugStoreListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tra cứu thông tin nhà thuốc";
  columnsKey = 'drug-store-list-columns';
  columnsControl = new FormControl();
  columns = [
    {name: 'STT', value: '#', display: true},
    {name: 'Mã', value: 'maNhaThuoc', display: true},
    {name: 'Tên', value: 'tenNhaThuoc', display: true},
    {name: 'Địa chỉ', value: 'diaChi', display: true},
    {name: 'Tỉnh thành', value: 'tenTinhThanh', display: true},
    {name: 'Điện thoại', value: 'dienThoai', display: true},
    {name: 'Người đại diện', value: 'nguoiDaiDien', display: true},
    {name: 'Người tạo', value: 'createdByUserName', display: true},
    {name: 'Ngày tạo\nNgày hết hạn', value: 'created', display: true},
    {name: 'TT gửi tin XN tạo TK', value: 'znsstatusSendCreateAccount', display: true},
    {name: 'Mã QG', value: 'connectivityCode', display: true},
    {name: 'TK LT', value: 'connectivityUserName', display: true},
    {name: 'C.S bán hàng', value: 'nameTypeBasis', display: true},
    {name: 'Nhân viên kinh doanh', value: 'businessId', display: true},
    {name: 'Chăm sóc sau bán hàng', value: 'supporterId', display: true},
    {name: 'Ghi chú kinh doanh', value: 'ghiChu', display: true},
    {name: 'Ghi chú triển khai', value: 'businessDescription', display: true},
    {name: 'Kết quả triển khai', value: 'resultBusinessId', display: true},
    {name: 'Tiền thanh toán', value: 'tienThanhToan', display: true},
    {name: 'Tổng tiền', value: 'paidAmount', display: true},
    {name: 'TT thu tiền', value: 'paidMoney', display: true},
    {name: 'TT gửi tin XNTT', value: 'znsstatusSendPayment', display: true},
    {name: 'KQ gửi tin XNTT', value: 'znsconfirmPaymentResult', display: true},
    {name: 'Ngày thu tiền', value: 'paidDate', display: true},
    {name: 'Tổng (nhập/ xuất)', value: 'tongNX', display: true},
    {name: 'Thao tác', value: 'action', display: true},
  ];
  storeTypes = [
    {name: "NT LT", value: 101},
    {name: "NT QL", value: 102},
    {name: "Công ty", value: 103},
    {name: "Phòng khám", value: 104},
    {name: "Đặt hàng", value: 105},
    {name: "Nhà tổng đặt hàng", value: 106},
  ];
  drugStorePaymentTypes = [
    {name: "Chưa thanh toán", value: 0},
    {name: "Thanh toán chưa đủ", value: 1},
    {name: "Đã thanh toán", value: 2}
  ];
  expiredTypes = [
    {name: "Không có hạn", value: 0},
    {name: "Có hạn", value: 1},
    {name: "Dưới 30 ngày", value: 2},
    {name: "Dưới 7 ngày", value: 3},
    {name: "Đã hết hạn", value: 4},
  ];
  typeDates = [
    {name: "Ngày tạo cơ sở", value: 1},
    {name: "Ngày giao dịch", value: 2},
    {name: "Ngày thu tiền", value: 3},
    {name: "Ngày tạo cơ sở và thu tiền", value: 4},
  ];
  znsTypes = [
    {name: "Xác nhận thanh toán", value: 1},
    {name: "Tạo tài khoản", value: 3}
  ];
  connectivityTypes = [
    {name: "Đã liên thông", value: 1},
    {name: "Chưa liên thông", value: 3}
  ];
  listSuperUser: any[] = [];
  listTieuChiTrienKhai: any[] = [];
  listTinhThanh: any[] = [];
  listTypeBasis: any[] = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhaThuocsService,
    private userProfileService: UserProfileService,
    private tieuChiTrienKhaiService: TieuChiTrienKhaiService,
    private trienKhaiService: TrienKhaiService,
    private tinhThanhsService: TinhThanhsService,
    private typeBasisService: TypeBasisService,
    private datePipe: DatePipe
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
    this.getColumns();
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getColumns() {
    const localColumns = this.storageService.get(this.columnsKey);
    if(localColumns){
      this.columns = localColumns.map((localCol: any) => {
        const column = this.columns.find(col => col.value === localCol.value);
        return column ? {...localCol, name: column.name} : localCol;
      });
    }
    this.columnsControl = new FormControl(this.getDisplayedColumns());
  }

  getDisplayedColumns() {
    return this.columns.filter(col => col.display).map(col => col.value);
  }

  getDisplayedColumnsName(value: any) {
    return this.columns.filter(col => col.value == value).map(col => col.name);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.storageService.set(this.columnsKey, this.columns);
  }

  onChangeDisplayedColumns(value: any) {
    this.columns = this.columns.map(col => {
      if (col.value == value) {
        return {...col, display: !col.display};
      }
      return col;
    });
    this.storageService.set(this.columnsKey, this.columns);
  }

  refreshColumn() {
    this.storageService.removeItem(this.columnsKey);
    window.location.reload();
  }

  getCreatedByUserName(createdByUserId: any) {
    return this.listSuperUser.find(x => x.id == createdByUserId)?.tenDayDu;
  }

  getTenTinhThanh(tinhThanhId: any) {
    return this.listTinhThanh.find(x => x.id == tinhThanhId)?.tenTinhThanh;
  }

  getNameTypeBasis(idTypeBasic: any) {
    return this.listTypeBasis.find(x => x.id == idTypeBasic)?.nameType;
  }

  getDataFilter() {
    // Danh sách tài khoản quyền hệ thống
    this.userProfileService.searchListUserManagement({roleName: 'SuperUser'}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listSuperUser = res.data;
      }
    });
    // Tiêu chí triển khai
    this.tieuChiTrienKhaiService.searchList({type: 0}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listTieuChiTrienKhai = res.data;
        this.listTieuChiTrienKhai.unshift({id: 0, name: "Chưa triển khai"});
      }
    });
    // Tỉnh thành
    this.tinhThanhsService.searchList({}).then((res: any) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
    // Chính sách bán hàng
    this.typeBasisService.searchList({}).then((res: any) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listTypeBasis = res.data;
      }
    });
  }

  async onResetSearching() {
    this.formData.reset();
    await this.searchPage();
  }

  async onBusinessChanged($event: any, item: any) {
    let body = item;
    item.businessId = $event?.id;
    let res =  await this.save(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async onSupporterChanged($event: any, item: any) {
    let body = item;
    item.supporterId = $event?.id;
    let res =  await this.save(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async onUpdateNoteType(item: any) {
    let res =  await this.save(item);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
    item.isEditNoteType = false;
  }

  async onUpdateBusinessDescription(item: any) {
    let res =  await this.save(item);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
    item.isEditBusinessDescription = false;
  }

  async onResultBusinessChanged($event: any, item: any) {
    let body = {
      maNhaThuoc: item.maNhaThuoc,
      tieuChiTrienKhaiId: $event?.id,
      active: true
    }
    let res = await this.trienKhaiService.create(body);
    if (res && res.status == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
  }

  async onCheckConnectivity(item: any) {
    // check duocquocgia account
  }

  async onUpdateInfoCustomerPayment(item: any) {
    let body = item;
    body.paidDate = this.datePipe.transform(body.paidDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    let res =  await this.save(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      return res.data;
    }
    item.isEditPaid = false;
  }

  async openRegionalDetailDialog(item: any) {
    this.dialog.open(RegionInformationEditDialogComponent, {
      data: {
        id: item.id,
        code: item.maNhaThuoc,
        name: item.tenNhaThuoc,
        address: item.diaChi,
        cityId: item.tinhThanhId,
        regionId: item.regionId,
        wardId: item.wardId,
        type: 'drug-store'
      },
      width: '600px',
    });
  }

  async openGeneralStoreMappingDialog(item: any) {
    this.dialog.open(DrugStoreGeneralMappingDialogComponent, {
      data: item,
      width: '600px',
    });
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

  override async delete(message: string, item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: !message ? 'Bạn có chắc chắn muốn xóa?' : message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        let body = item;
        item.hoatDong = false;
        let res =  await this.save(body);
        if (res && res.statusCode == STATUS_API.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        }
      },
    });
  }

  override async restore(message: string, item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: !message ? 'Bạn có chắc chắn muốn khôi phục ?' : message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        let body = item;
        item.hoatDong = true;
        let res =  await this.save(body);
        if (res && res.statusCode == STATUS_API.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        }
      },
    });
  }
}
