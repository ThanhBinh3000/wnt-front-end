import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {NhomThuocService} from "../../../services/categories/nhom-thuoc.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'drug-group-add-edit-dialog',
  templateUrl: './drug-group-add-edit-dialog.component.html',
  styleUrls: ['./drug-group-add-edit-dialog.component.css'],
})
export class DrugGroupAddEditDialogComponent extends BaseComponent implements OnInit {
  @Input() drugGroupId: any;
  @Output() setClose = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _service: NhomThuocService
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
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
    console.log("ngOnInit", this.drugGroupId);
    if (this.drugGroupId) {
      const data = await this.detail(this.drugGroupId);
      if (data) {
        console.log(data);
        this.formData.patchValue({
          tenNhomThuoc: data.tenNhomThuoc,
          kyHieuNhomThuoc: data.kyHieuNhomThuoc
        });
      }
    }
  }

   saveEdit() {
    console.log(this.drugGroupId);
    // let body = this.formData.value;
    // let data = await this.save(body);
    // if(data){
    //   this.closeModal();
    // }
    // if (this.drugGroupId) {
    //   const data = await this.detail(this.drugGroupId);
    //   if (data) {
    //     console.log(data);
    //     this.formData.patchValue({
    //       tenNhomThuoc: data.tenNhomThuoc,
    //       kyHieuNhomThuoc: data.kyHieuNhomThuoc
    //     });
    //   }
    // }
  }

  closeModal() {
    this.setClose.emit();
  }


}
