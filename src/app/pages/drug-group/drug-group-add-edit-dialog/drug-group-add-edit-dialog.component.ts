import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'drug-group-add-edit-dialog',
  templateUrl: './drug-group-add-edit-dialog.component.html',
  styleUrls: ['./drug-group-add-edit-dialog.component.css'],
})
export class DrugGroupAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: NhomThuocService,
    public dialogRef: MatDialogRef<DrugGroupAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugGroupID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id : [],
      tenNhomThuoc: ['', Validators.required],
      kyHieuNhomThuoc: [''],
      maNhaThuoc: [1],
      maNhomThuoc: [1],
      referenceId: [1],
      typeGroupProduct: [1],
      storeId: [1]
    });
  }

  async ngOnInit() {
    if (this.drugGroupID) {
      const data = await this.detail(this.drugGroupID);
      if (data) {
        console.log(data);
        this.formData.patchValue(data);
      }
    }
  }

   async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if(data){
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
