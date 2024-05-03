import {Component, Inject, Injector} from '@angular/core';
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Validators} from "@angular/forms";
import {LOAI_SAN_PHAM} from "../../../constants/config";

@Component({
  selector: 'app-modal-preview-image',
  templateUrl: './modal-preview-image.component.html',
  styleUrl: './modal-preview-image.component.css'
})
export class ModalPreviewImageComponent {
  constructor(
    injector: Injector,
    private _service: NhomThuocService,
    public dialogRef: MatDialogRef<ModalPreviewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  closeModal(){
    this.dialogRef.close();
  }
}
