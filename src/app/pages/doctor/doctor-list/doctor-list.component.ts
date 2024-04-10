import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DoctorAddEditDialogComponent } from '../doctor-add-edit-dialog/doctor-add-edit-dialog.component';

@Component({
  selector: 'doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách bác sỹ";
  displayedColumns = ['#', 'tenBacSy', 'nhomBacSy', 'dienThoai', 'diaChi', 'active', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: BacSiesService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenBacSy: [],
      dataDelete: [false]
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

  async openAddEditDialog(doctorID: any) {
    const dialogRef = this.dialog.open(DoctorAddEditDialogComponent, {
      data: doctorID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}