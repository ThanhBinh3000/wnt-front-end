import { AfterViewInit, Component, ElementRef, HostListener, Injector, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { NgSelectComponent } from '@ng-select/ng-select';
import { InventoryItemUpdateDialogComponent } from '../inventory-item-update-dialog/inventory-item-update-dialog.component';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-inventory-add-edit',
  templateUrl: './inventory-add-edit.component.html',
  styleUrl: './inventory-add-edit.component.css'
})
export class InventoryAddEditComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tạo phiếu kiểm kê";
  maNhaThuoc = this.authService.getNhaThuoc().maNhaThuoc;

  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  listNhomThuoc: any[] = [];
  itemWaiting: any = {}
  dataChuaBienDong: any = [];

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
    private _service: PhieuKiemKeService,
    private thuocsService: ThuocService,
    private nhomThuocService: NhomThuocService,
    private datePipe: DatePipe
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.maNhaThuoc,
      thuocThuocIds: [{}],
      nhomThuocMaNhomThuoc: [],
      created: [],
      noteDate: [],
      id: [0],
      phieuNhapMaPhieuNhap: [0],
      phieuXuatMaPhieuXuat: [0],
      userProfileUserId: [0],
      daCanKho: [],
      active: [true],
      soPhieu: [0],
      archivedId: [0],
      storeId: [0],
      archivedDate: [],
      bienDong: [false]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl);
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
      this.dataChuaBienDong = data.chiTiets;
      this.title = "Cập nhật phiếu kiểm kê";
    } else {
      this.formData.controls['created'].setValue(this.datePipe.transform(moment().utcOffset(420).endOf('day').toDate(),
        'dd/MM/yyyy HH:mm:ss') ?? '');
      //kiểm tra data truyền từ form thuốc chưa kiểm kê
      let thuocChuaKiemKes = this.storageService.get("thuocChuaKiemKe");
      this.storageService.removeItem("thuocChuaKiemKe");
      if (thuocChuaKiemKes && thuocChuaKiemKes.length > 0) {
        this.onMutilAddNew(thuocChuaKiemKes);
      }
    }
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  ngAfterViewInit() {
    this.focusSearchDrug();
  }

  async onDelete(item: any) {
    var index = this.dataTable.indexOf(item);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
  }


  getDataFilter() {
    // Danh sách nhóm thuốc
    let body = { dataDelete: false, maNhaThuoc: this.maNhaThuoc };
    this.nhomThuocService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data;
      }
    });
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.maNhaThuoc,
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

  @ViewChildren('pickerNgayKiemKe') pickerNgayKiemKe!: Date;
  async onDateChange(date: Date) {
    let noteDate = this.formData.get('noteDate')?.value;
    this.formData.controls['created'].setValue(this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '');
  }

  async onDrugChange(data: any, isOnly: boolean = true) {
    if (data && data.id > 0) {
      this.thuocsService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.onConvertFromDrugToItem(res.data, true);
        }
      });

      setTimeout(() => this.focusInputSoLuongCho(), 100);
    }
  }

  async onAddNew(item: any) {
    //kiểm tra thuốc có trong phiếu chưa
    if (!item.thuocThuocId) return;
    let data = this.dataTable.filter(x => x.thuocThuocId == item.thuocThuocId);
    this._service.checkThuocTonTaiKiemKe({ thuocThuocId: item.thuocThuocId }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        if (res.data || data.length > 0) {
          let content = res.data
            ? `Mã thuốc ${item.maThuoc} đã tồn tại trong phiếu khác`
            : `Mã thuốc ${item.maThuoc} đã tồn tại trong danh sách, bạn có muốn cộng dồn số lượng ?`
          this.modal.confirm({
            closable: false,
            title: 'Xác nhận',
            content: content,
            okText: 'Đồng ý',
            cancelText: 'Đóng',
            okDanger: true,
            width: 310,
            onOk: async () => {
              if (data.length > 0) {
                this.dataTable.filter(x => x.thuocThuocId == item.thuocThuocId).map(x => x)[0].thucTe =
                  Number(this.dataTable.filter(x => x.thuocThuocId == item.thuocThuocId).map(x => x)[0].thucTe) + Number(item.thucTe);
              }
            }
          });
        } else {
          this.dataTable.push(item);
        }
        this.itemWaiting = {};
      }
    });
    setTimeout(() => this.focusSearchDrug(), 100);
  }

  @ViewChild('inputSoLuongCho') inputSoLuongCho!: ElementRef;
  async focusInputSoLuongCho() {
    this.inputSoLuongCho.nativeElement.focus();
  }

  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  async focusSearchDrug() {
    this.selectDrug?.focus();
  }

  @ViewChildren('inputSoLuong') inputSoLuong!: QueryList<ElementRef>;
  async focusInputSoLuong() {
    if (this.inputSoLuong.last) {
      this.inputSoLuong.last.nativeElement.focus();
    }
  }

  async openInventoryItemUpdateDialog(item: any) {
    if (!item.thuocThuocId) return;
    const dialogRef = this.dialog.open(InventoryItemUpdateDialogComponent, {
      data: item,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }

  addThuocTheoNhom() {
    if (this.formData.value?.nhomThuocMaNhomThuoc > 0) {
      this.thuocsService.searchList({
        nhaThuocMaNhaThuoc: this.maNhaThuoc,
        typeService: LOAI_SAN_PHAM.THUOC,
        nhomThuocMaNhomThuoc: this.formData.value?.nhomThuocMaNhomThuoc
      }).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          if (res.data.length > 0) {
            this.onMutilAddNew(res.data);
          }
        }
      });
    }
  }

  async onSave(canKho: boolean) {
    if (this.dataTable.filter(x => x.thuocThuocId > 0).length == 0 && !this.itemWaiting.thuocThuocId) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    this.formData.controls['daCanKho'].setValue(canKho);
    let body = this.formData.value;
    if (this.dataTable.length == 0 && this.itemWaiting.thuocThuocId > 0) {
      await this.onAddNew(this.itemWaiting);
    }
    body.chiTiets = this.dataTable;
    if(this.formData.value?.daCanKho){
      this.modal.confirm({
        closable: false,
        title: 'Cảnh báo',
        content: `Bạn có muốn cân kho phiếu kiểm kê này không?`,
        okText: 'Đồng ý',
        cancelText: 'Bỏ qua',
        okDanger: true,
        width: 310,
        onOk: async () => {
          this._service.canKho(body).then((res)=>{
            if (res && res.status == STATUS_API.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.router.navigate(['/management/inventory/detail', res.data.id]);
            }
          });
        }
      });
     
    }else{
      this.save(body).then(data => {
        if (data) {
          this.router.navigate(['/management/inventory/detail', data.id]);
        }
      });
    }
    
  }

  locThuocBienDong() {
    console.log(this.formData.value?.bienDong);
    if (this.formData.value?.bienDong) {
      this._service.checkBienDong({ id: this.idUrl }).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.dataTable = res.data;
        }
      });
    } else {
      this.dataTable = this.dataChuaBienDong;
    }
  }

  onUpdateInventories() {
    if (this.idUrl > 0 && !this.formData.value?.daCanKho) {
      this.dataTable.forEach((x: any) => {
        this.thuocsService.getDetail(x.thuocThuocId).then((res) => {
          if (res?.status == STATUS_API.SUCCESS) {
            x.tonKho = res.data.inventory ? res.data.inventory.lastValue : x.tonKho;
          }
        });
      });
    }
  }

  onConvertFromDrugToItem(item: any, isOnly: boolean = false) {
    if (!item) return;
    let data: any = {};
    data.thuocThuocId = item.id;
    data.donGia = item.inventory ? item.inventory.lastInPrice : 0;
    data.thucTe = 0;
    data.tonKho = item.inventory ? item.inventory.lastValue : 0;
    data.tenDonViTinhLe = item.tenDonViTinhXuatLe;
    data.soLo = item.inventory ? item.inventory.serialNumber : '';
    data.hanDung = item.inventory ? item.inventory.expiredDate : null;
    data.retailPrice = item.giaBanLe;
    data.tonHT = item.inventory ? item.inventory.lastValue : 0;
    data.archiveDrugId = 0;
    data.archivedId = 0;
    data.referenceId = 0;
    data.storeId = 0;
    data.isProdRef = false;
    data.tenThuocText = item.tenThuoc;
    data.maThuoc = item.maThuoc;
    data.tenThuoc = item.tenThuoc;
    data.tenNhomThuoc = item.tenNhomThuoc;
    if (isOnly) {
      this.itemWaiting = data;
    } else {
      this.dataTable.push(data);
    }
  }

  onMutilAddNew(items: any[]) {
    //kiểm tra thuốc đã tồn tại phiếu kiểm kê chưa
    let thuocsTonTai: any = [];
    let thuocTonTaiTrongPhieu: any = [];
    this._service.searchPageThuocChuaKiemKe({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        if (res.data.length > 0) {
          let drugIds = res.data.map((x: any) => x.id);
          items.forEach(x => {
            if (drugIds.includes(x.id)) {
              //check thuốc có trong phiếu chưa
              if (this.dataTable.filter(xx => xx.thuocThuocId == x.id).length > 0) {
                thuocTonTaiTrongPhieu.push(x);
              } else {
                this.onConvertFromDrugToItem(x);
              }
            } else {
              thuocsTonTai.push(x.maThuoc);
            }
          });
          if (thuocsTonTai.length > 0) {
            this.modal.confirm({
              closable: false,
              title: 'Cảnh báo',
              content: `Mã thuốc ${thuocsTonTai.splice(',')} tồn tại trong phiếu kiểm kê khác`,
              okText: 'Đồng ý',
              cancelText: 'Đóng',
              okDanger: true,
              width: 310,
              onOk: async () => {
              }
            });
          }
          if (thuocTonTaiTrongPhieu.length > 0) {
            this.modal.confirm({
              closable: false,
              title: 'Cảnh báo',
              content: `Mã thuốc ${thuocTonTaiTrongPhieu.map((x: any) => x.maThuoc).splice(',')} tồn tại trong phiếu bạn có muốn cộng dồn số lượng`,
              okText: 'Đồng ý',
              cancelText: 'Đóng',
              okDanger: true,
              width: 310,
              onOk: async () => {
                thuocTonTaiTrongPhieu.forEach((x: any) => {
                  this.dataTable.filter(xx => xx.thuocThuocId == x.id).map(xx => xx)[0].thucTe =
                    Number(this.dataTable.filter(xx => xx.thuocThuocId == x.id).map(xx => xx)[0].thucTe) + Number(0);
                })
              }
            });
          }
        }
      }
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "F9":
        this.onSave(false);
        break;
      case "F1":
        let baseUrl = window.location.href.replace(this.router.url, '');
        const url = new URL("management/inventory/add", baseUrl).href;
        window.open(url, '_blank');
        break;
    }
  }
}
