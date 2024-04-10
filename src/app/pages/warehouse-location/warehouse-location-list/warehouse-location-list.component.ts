import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WarehouseLocationService } from '../../../services/products/warehouse-location-service';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '../../../component/base/base.component';
import { WarehouseLocationAddEditDialogComponent } from '../warehouse-location-add-edit-dialog/warehouse-location-add-edit-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'warehouse-location-list',
  templateUrl: './warehouse-location-list.component.html',
  styleUrls: ['./warehouse-location-list.component.css'],
})
export class WarehouseLocationListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Quản lý vị trí tủ/kho";
  displayedColumns = ['#', 'code', 'nameWarehouse', 'descriptions', 'action'];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: WarehouseLocationService,
    // private dialog: MatDialog
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      nameWarehouse : [],
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

  async openAddEditDialog(warehouseLocationID: any) {
    const dialogRef = this.dialog.open(WarehouseLocationAddEditDialogComponent, {
      data: warehouseLocationID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
