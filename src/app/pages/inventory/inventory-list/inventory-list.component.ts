import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { ThuocService } from '../../../services/products/thuoc.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css'
})
export class InventoryListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách phiếu kiểm kê";

  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();

  displayedColumns = ['stt', 'id', 'nhanVien', 'ngayTao', 'slThuoc', 'canKho', 'action'];
  
  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : PhieuKiemKeService,
    private thuocsService : ThuocService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
      thuocThuocId: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    console.log(this.dataTable);
    this.getDataFilter();
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
}
