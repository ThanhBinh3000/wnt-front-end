import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../../component/modal/modal.component';

@Component({
  selector: 'chi-tiet-don-dien-tu-dialog',
  templateUrl: './chi-tiet-don-dien-tu-dialog.component.html',
  styleUrl: './chi-tiet-don-dien-tu-dialog.component.css'
})
export class ChiTietDonDienTuDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public thongTinDon: any,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {

  }

  async ngOnInit() {
    console.log(this.thongTinDon);
  }
  onTilteSampleNote(type: any) {
    var val = '';
    if (type == 'c') {
      val = 'ĐƠN THUỐC';
    }
    if (type == 'y') {
      val = 'ĐƠN THUỐC Y';
    }
    if (type == 'h') {
      val = 'ĐƠN THUỐC HƯỚNG TÂM THẦN';
    }
    if (type == "n") {
      val = 'ĐƠN THUỐC GÂY NGHIỆN';
    }
    return val;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
