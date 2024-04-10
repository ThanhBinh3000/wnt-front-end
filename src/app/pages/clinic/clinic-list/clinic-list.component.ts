import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PhongKhamsService } from '../../../services/medical/phong-khams.service';
import { BaseComponent } from '../../../component/base/base.component';
import { MatSort } from '@angular/material/sort';
import { ClinicAddEditDialogComponent } from '../clinic-add-edit-dialog/clinic-add-edit-dialog.component';

@Component({
  selector: 'app-clinic-list',
  templateUrl: './clinic-list.component.html',
  styleUrl: './clinic-list.component.css'
})
export class ClinicListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách phòng khám";
  displayedColumns = ['stt', 'tenPhongKham', 'description', 'action'];
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhongKhamsService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenPhongKham: [],
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.searchPage();
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  async openAddEditDialog(clinicID: any) {
    const dialogRef = this.dialog.open(ClinicAddEditDialogComponent, {
      data: clinicID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

}
