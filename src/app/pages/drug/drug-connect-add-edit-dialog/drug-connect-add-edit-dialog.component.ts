import {Component, Inject, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {STATUS_API} from "../../../constants/message";
import {ConnectivityDrugService} from "../../../services/products/connectivity-drug.service";
import {QuocGiaService} from "../../../services/categories/quoc-gia.service";
import {catchError, debounceTime, from, Observable, of, Subject, switchMap} from "rxjs";
import {Validators} from "@angular/forms";

@Component({
  selector: 'drug-connect-add-edit-dialog',
  templateUrl: './drug-connect-add-edit-dialog.component.html',
  styleUrls: ['./drug-connect-add-edit-dialog.component.css'],
})
export class DrugConnectAddEditDialogComponent extends BaseComponent implements OnInit {
  listQuocGia : any;
  listConnectivityDrug$ = new Observable<any[]>;
  searchConnectivityDrugTerm$ = new Subject<string>();

  constructor(
    injector: Injector,
    private _service: ConnectivityDrugService,
    private quocGiaService: QuocGiaService,
    public dialogRef: MatDialogRef<DrugConnectAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugId: any,
  ) {
    super(injector, _service);
    this.isGeneralStore()
    this.formData = this.fb.group({
      id: [null],
      drugId: [null],
      maThuoc: [null],
      tenThuoc: [null],
      connectivityDrugID: [null],
      connectivityCode: [null],
      connectivityDrugFactor: [null],
      connectivityTypeId: [null],
      retailUnitId: [null],
      retailUnitName: [null],
      connectivityId: [null],
      name: [''],
      unitName: [null],
      manufacturer: [null, Validators.required],
      contents: [null, Validators.required],
      packingWay: [null],
      registeredNo: [null, Validators.required],
      activeSubstance: [null, Validators.required],
      countryId: [0],
      dosageForms: [null],
      smallestPackingUnit: [null],
      declaredPrice: [0],
      wholesalePrice: [0],
      importers: [null],
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.drugId) {
      let res = await this._service.detailThuocLienThong(this.drugId);
      if (res?.status === STATUS_API.SUCCESS) {
        const data = res.data;
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            this.formData.addControl(key, this.fb.control(data[key]));
          }
        }
        this.formData.patchValue(res.data);
      }
    }
  }

  getDataFilter(){
    // Quốc gia
    this.quocGiaService.searchList({}).then((res)=>{
      if(res?.status == STATUS_API.SUCCESS){
        this.listQuocGia = res.data;
        this.listQuocGia.unshift({id: 0, name: '--Mặc định--'})
      }
    });
    //Search thuốc quốc gia
    this.listConnectivityDrug$ = this.searchConnectivityDrugTerm$.pipe(
      debounceTime(500),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
          };
          return from(this._service.searchPage(body).then((res) => {
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

  onChangeConnectivityDrug(newConnectivityDrug: any) {
    if(newConnectivityDrug){
      const { id, drugId, connectivityDrugID, ...restOfNewConnectivityDrug } = newConnectivityDrug;
      const value = { ...this.formData.value, ...restOfNewConnectivityDrug };
      this.formData.patchValue(value);
    }
  }

  async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  isGeneralStore() {
    return this.authService?.getNhaThuoc()?.isGeneralPharmacy;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
