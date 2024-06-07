import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE } from '../../../constants/message';
import { SETTING } from '../../../constants/setting';


@Component({
  selector: 'sample-note-history-dialog',
  templateUrl: './sample-note-history-dialog.component.html',
  styleUrls: ['./sample-note-history-dialog.component.css'],
})
export class SampleNoteHistoryDialogComponent extends BaseComponent implements OnInit {
  listData = [];
  displayedColumns = ['stt', 'id', 'noteDate', 'doctor', 'noteName', 'description', 'tenThuoc', 'donVi', 'soLuong', 'ghiChuThuoc', 'action'];

  // Settings
  useSampleNoteFromParent = this.authService.getSettingByKey(SETTING.USE_SAMPLE_NOTE_FROM_PARENT);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: SampleNoteService,
    public dialogRef: MatDialogRef<SampleNoteHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      maNhaThuoc: [this.useSampleNoteFromParent.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc()],
      patientId: [],
    });
  }

  async ngOnInit() {
    console.log(this.data);
    this.formData.patchValue({patientId: this.data.id});
    this.searchPage();
    this.dataTable.forEach(i=>{
      i.chiTiets
    });
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
