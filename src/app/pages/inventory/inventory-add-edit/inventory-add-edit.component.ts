import { AfterViewInit, Component, ElementRef, Injector, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { STATUS_API } from '../../../constants/message';
import { NgSelectComponent } from '@ng-select/ng-select';
import { InventoryItemUpdateDialogComponent } from '../inventory-item-update-dialog/inventory-item-update-dialog.component';

@Component({
  selector: 'app-inventory-add-edit',
  templateUrl: './inventory-add-edit.component.html',
  styleUrl: './inventory-add-edit.component.css'
})
export class InventoryAddEditComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Tạo phiếu kiểm kê";
  maNhaThuoc = this.authService.getNhaThuoc().maNhaThuoc

  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  listNhomThuoc : any[] = [];
  itemWaiting: any = {}

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
    private thuocsService : ThuocService,
    private nhomThuocService: NhomThuocService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.maNhaThuoc,
      thuocThuocIds: [{}],
      nhomThuocMaNhomThuoc : []
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  ngAfterViewInit() {
    this.focusSearchDrug();
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
            nhaThuocMaNhaThuoc: this.formData.get('maNhaThuoc')?.value,
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

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocsService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          this.itemWaiting.thuocThuocId = item.id;
          this.itemWaiting.donGia = item.inventory ? item.inventory.LastInPrice : 0;
          this.itemWaiting.thucTe = 0;
          this.itemWaiting.tonKho = item.inventory ? item.inventory.lastValue : 0;
          this.itemWaiting.tenDonViTinhLe = item.tenDonViTinhXuatLe;
          this.itemWaiting.soLo = item.inventory ? item.inventory.SerialNumber : '';
          this.itemWaiting.hanDung = item.inventory ? item.inventory.ExpiredDate : null;
          this.itemWaiting.retailPrice = item.giaBanLe;
          this.itemWaiting.tonHT = item.inventory ? item.inventory.lastValue : 0;
          this.itemWaiting.archiveDrugId = 0;
          this.itemWaiting.archivedId = 0;
          this.itemWaiting.referenceId = 0;
          this.itemWaiting.storeId = 0;
          this.itemWaiting.isProdRef = false;
          this.itemWaiting.tenThuocText = item.tenThuoc;
          this.itemWaiting.maThuoc = item.maThuoc;
          this.itemWaiting.tenThuoc = item.tenThuoc;
          this.itemWaiting.tenNhomThuoc = item.tenNhomThuoc;
        }
      });
      setTimeout(() => this.focusInputSoLuong(), 100);
    }
  }

  async onAddNew(item : any){
    console.log(this.dataTable);
     //kiểm tra thuốc có trong phiếu chưa
     //Mã thuốc TH523 đã tồn tại trong danh sách, bạn có muốn cộng dồn số lượng 
     if(!item.thuocThuocId) return;
     var data = this.dataTable.filter(x => x.thuocThuocId == item.thuocThuocId);
     if(data.length > 0){
     }else{
      this.dataTable.push(item);
     }
     this.itemWaiting = {};
     setTimeout(() => this.focusSearchDrug(), 100);
  }

  @ViewChild('inputSoLuong') inputSoLuongs!: NgSelectComponent;
  async focusInputSoLuong() {
    this.inputSoLuongs?.focus();
  }

  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  async focusSearchDrug() {
    this.selectDrug?.focus();
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

  async onDelete(item: any) {
    var index = this.dataTable.indexOf(item);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
  }
}
