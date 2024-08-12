import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThuocService } from '../../../services/products/thuoc.service';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MESSAGE } from '../../../constants/message';

@Component({
  selector: 'tinh-lieu-dialog',
  templateUrl: './tinh-lieu-dialog.component.html',
  styleUrls: ['./tinh-lieu-dialog.component.css'],
})
export class TinhLieuDialogComponent extends BaseComponent implements OnInit {
  listHoatChats: any = [
    {
      name: "Amoxicillin",
      doseByWeight: "20-50 mg/kg, chia 2-3 lần/ngày (mỗi 8-12h)",
      doseMinimum: 20,
      doseMaximum: 50,
      contents: [
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" },
        { name: "Thuốc bột 500mg", value: 500, unit: "gói" }
      ],
      doseOfTimeADay: [2, 3],
      bonus: []
    },
    {
      name: "Ampicillin",
      doseByWeight: "40-100 mg/kg, chia 2-3 lần/ngày (mỗi 8-12h)",
      doseMinimum: 40,
      doseMaximum: 100,
      contents: [
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" }
      ],
      doseOfTimeADay: [2, 3],
      bonus: []
    },
    {
      name: "Amoxicillin-Clavulanic",
      doseByWeight: "40/5-80/10 mg/kg, chia 2-3 lần/ngày (mỗi 8-12h)",
      doseMinimum: 40,
      doseMaximum: 80,
      contents: [
        { name: "250/31,25-250/62,5", value: 250, unit: "gói" },
        { name: "500/62,5-500/125", value: 500, unit: "gói" },
        { name: "875/125", value: 875, unit: "gói" },
        { name: "Klavunamox 400/57", value: 400, unit: "gói" }
      ],
      doseOfTimeADay: [2, 3],
      bonus: []
    },
    {
      name: "Cephalexin",
      doseByWeight: "25-60 mg/kg, chia 3 lần/ngày (mỗi 8h)",
      doseMinimum: 25,
      doseMaximum: 60,
      contents: [
        { name: "Hỗn dịch 125mg/5ml", value: 25, unit: "ml" },
        { name: "Hỗn dịch 250mg/5ml", value: 50, unit: "ml" },
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" }
      ],
      doseOfTimeADay: [3],
      bonus: [
        "Trẻ dưới 5 tuổi: 125mg mỗi 8h",
        "Trẻ trên 5 tuổi: 250mg mỗi 8h"
      ]
    },
    {
      name: "Cephadroxil",
      doseByWeight: "30-50 mg/kg, chia 2 lần/ngày (mỗi 12h), tối đa: 100mg/kg/ngày",
      doseMinimum: 30,
      doseMaximum: 100,
      contents: [
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" },
        { name: "Hỗn dịch 250mg/5ml", value: 50, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: []
    },
    {
      name: "Cefuroxim",
      doseByWeight: "10-15 mg/kg mỗi 12h",
      doseMinimum: 10,
      doseMaximum: 15,
      contents: [
        { name: "Thuốc bột 125mg", value: 125, unit: "gói" },
        { name: "Hỗn dịch 125mg/5ml", value: 25, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: []
    },
    {
      name: "Cefprozil",
      doseByWeight: "*NK hô hấp trên: 7,5mg/kg mỗi 12h hoặc 20mg/kg mỗi 24h",
      doseMinimum: 7.5,
      doseMaximum: 20,
      contents: [
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" },
        { name: "Cefprozil 125mg/5ml", value: 25, unit: "ml" },
        { name: "Pricefil 250mg/5ml", value: 50, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: [
        "Viêm tai giữa: 15mg/kg",
        "Dùng cho trẻ > 6 tháng"
      ]
    },
    {
      name: "Cefaclor",
      doseByWeight: "20-40 mg/kg chia 2-3 lần/ngày (mỗi 8-12h)",
      doseMinimum: 20,
      doseMaximum: 40,
      contents: [
        { name: "Thuốc bột 125mg", value: 125, unit: "gói" },
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" },
        { name: "Ceclor 125mg/5ml", value: 25, unit: "ml" }
      ],
      doseOfTimeADay: [2, 3],
      bonus: []
    },
    {
      name: "Cefixim",
      doseByWeight: "4 mg/kg mỗi 12h",
      doseMinimum: 4,
      doseMaximum: 4,
      contents: [
        { name: "Thuốc bột 50mg", value: 50, unit: "gói" },
        { name: "Thuốc bột 100mg", value: 100, unit: "gói" },
        { name: "Bactirid 100mg/5ml", value: 20, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: []
    },
    {
      name: "Cefdinir",
      doseByWeight: "7 mg/kg mỗi 12h",
      doseMinimum: 7,
      doseMaximum: 7,
      contents: [
        { name: "Thuốc bột 125mg", value: 125, unit: "gói" },
        { name: "Thuốc bột 300mg", value: 300, unit: "gói" },
        { name: "Zebacef 125mg/5ml", value: 25, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: []
    },
    {
      name: "Cefpodoxim",
      doseByWeight: "5 mg/kg mỗi 12h",
      doseMinimum: 5,
      doseMaximum: 5,
      contents: [
        { name: "Thuốc bột 100mg", value: 100, unit: "gói" },
        { name: "Hỗn dịch 40mg/5ml", value: 8, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: [
        "Trẻ em trên 12 tuổi: 100 - 200 mg mỗi 12h",
      ]
    },
    {
      name: "Cefditoren",
      doseByWeight: "3-6 mg/kg mỗi 8h tối đa 600mg/ngày",
      doseMinimum: 3,
      doseMaximum: 6,
      contents: [
        { name: "Cốm 50mg", value: 50, unit: "gói" }
      ],
      doseOfTimeADay: [3]
    },
    {
      name: "Azithromycin",
      doseByWeight: "10 mg/kg/ngày, dùng 1 lần/ngày, trong 3 ngày",
      doseMinimum: 10,
      doseMaximum: 10,
      contents: [
        { name: "Bột pha hỗn dịch 200mg", value: 200, unit: "gói" },
        { name: "Bột pha hỗn dịch 100mg", value: 100, unit: "gói" },
        { name: "Bột pha hỗn dịch 125mg", value: 125, unit: "gói" },
        { name: "Bột pha hỗn dịch 250mg", value: 250, unit: "gói" },
        { name: "Hỗn dịch 200mg/5ml", value: 40, unit: "ml" }
      ],
      doseOfTimeADay: [1]
    },
    {
      name: "Clarithromycin",
      doseByWeight: "7,5 mg/kg mỗi 12h",
      doseMinimum: 7.5,
      doseMaximum: 7.5,
      contents: [
        { name: "Klacid 125mg/5 ml", value: 25, unit: "ml" }
      ],
      doseOfTimeADay: [2],
      bonus: [
        "Trẻ >12 tuổi hoặc trên 30kg có thể dùng theo liều người lớn: 250-500 mg mỗi 12h",
      ]
    },
    {
      name: "Roxythromycin",
      doseByWeight: "2,5-4 mg/kg mỗi 12h",
      doseMinimum: 2.5,
      doseMaximum: 4,
      contents: [
        { name: "Thuốc bột 50mg", value: 50, unit: "gói" },
        { name: "Rexamine 50mg/5ml", value: 10, unit: "ml" }
      ],
      doseOfTimeADay: [2]
    },
    {
      name: "Erythromycin",
      doseByWeight: "15-25 mg/kg mỗi 12h",
      doseMinimum: 15,
      doseMaximum: 25,
      contents: [
        { name: "Thuốc bột 250mg", value: 250, unit: "gói" },
        { name: "Erykid 250 mg/5ml", value: 50, unit: "ml" }
      ],
      doseOfTimeADay: [2]
    },
    {
      name: "Ciprofloxacin",
      doseByWeight: "20 mg/kg mỗi 12h, tối đa 750mg/12h",
      doseMinimum: 20,
      doseMaximum: 40,
      contents: [
        { name: "Ciprobay 500mg", value: 500, unit: "viên" }
      ],
      doseOfTimeADay: [2]
    },
    {
      name: "Paracetamol",
      doseByWeight: "10-15 mg/kg mỗi 3-4h, tối đa 60 mg/kg/ngày",
      doseMinimum: 10,
      doseMaximum: 15,
      contents: [
        { name: "Efferalgan 80 (gói)", value: 80, unit: "gói" },
        { name: "Efferalgan 150 (gói)", value: 150, unit: "gói" },
        { name: "Efferalgan 250 (gói)", value: 250, unit: "gói" },
        { name: "120mg/5ml", value: 24, unit: "ml" },
        { name: "80mg/2,5ml", value: 32, unit: "ml" }
      ],
      doseOfTimeADay: [3, 4]
    },
    {
      name: "Ibuprofen",
      doseByWeight: "Hạ sốt: 20-30 mg/kg/ngày chia 3-4 lần",
      doseMinimum: 20,
      doseMaximum: 30,
      contents: [
        { name: "Gói 100mg", value: 100, unit: "gói" },
        { name: "Brufen 100mg/5ml", value: 20, unit: "ml" },
        { name: "Profen ống 100mg/10ml", value: 100, unit: "ống" }
      ],
      doseOfTimeADay: [3, 4],
      bonus: [
        "5-14,5 kg: 50mg/lần, tối đa 150mg/ngày",
        "14,5-25 kg: 100mg/lần, tối đa 400mg/ngày",
        "25-40kg: 200mg/lần, tối đa 800mg/ngày"
      ]
    },
    {
      name: "Metronidazol",
      doseByWeight: "20-40 mg/kg/ngày chia 3 lần",
      doseMinimum: 20,
      doseMaximum: 40,
      contents: [
        { name: "Viên nén 250mg", value: 250, unit: "viên" },
        { name: "Hỗn dịch 200mg/5ml", value: 40, unit: "ml" }
      ],
      doseOfTimeADay: [3],
      bonus: [
        "Dưới 8 tuần: 7,5 mg/kg mỗi 12h",
        "8 tuần-12 tuổi: 7,5 mg/kg mỗi 8h"
      ]
    },
    {
      name: "Sulfamethoxazol-Trimethoprim",
      doseByWeight: "20-40 mg/kg/ngày chia 3 lần",
      doseMinimum: 20,
      doseMaximum: 40,
      contents: [
        { name: "Thuốc bột 200/40", value: 40, unit: "gói" },
        { name: "Thuốc bột 400/80", value: 80, unit: "gói" },
        { name: "Biseptol 200mg/40mg/5ml", value: 8, unit: "ml" }
      ],
      doseOfTimeADay: [3]
    },
    {
      name: "Racecadotril",
      doseByWeight: "1,5 mg/kg/lần, ngày uống 3 lần",
      doseMinimum: 1.5,
      doseMaximum: 1.5,
      contents: [
        { name: "Hidrasec gói 10mg", value: 10, unit: "gói" },
        { name: "Hidrasec gói 30mg", value: 30, unit: "gói" }
      ],
      doseOfTimeADay: [3]
    }
  ];
  private itemsSource = new BehaviorSubject<any[]>(this.listHoatChats);
  items$ = this.itemsSource.asObservable();

  selectedItem: any = {};

  private viewModelSource = new BehaviorSubject<any>({ items: [] });
  viewModel$ = this.viewModelSource.asObservable();

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<TinhLieuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);

  }

  async ngOnInit() {

  }

  onItemChanged(selectedItem: any): void {
    if (!selectedItem) return;
    this.selectedItem = selectedItem;
    this.selectedItem.selectedContent = String(selectedItem.contents[0].name);
    this.selectedItem.selectedDoseOfTimeADay = String(selectedItem.doseOfTimeADay[0]);

    this.getValueAndUnitByName();
  }

  // Check if an item with the same name, selected content, and dose time of day already exists
  checkSameName(): boolean {
    const items = this.viewModelSource.getValue().items;
    const selectedItem = this.selectedItem; // Get the current selected item

    if (items && items.length > 0 && selectedItem) {
      return items.some((item: any) =>
        item.name === selectedItem.name &&
        item.selectedContent === selectedItem.selectedContent &&
        item.selectedDoseOfTimeADay === selectedItem.selectedDoseOfTimeADay
      );
    }
    return false;
  }

  addNewItem(weight: number) {
    if (!this.selectedItem || Object.keys(this.selectedItem).length === 0) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn hoạt chất.');
      return;
    }
    else if(this.checkSameName()){
      this.notification.error(MESSAGE.ERROR, 'Đã tồn tại hoặt chất và hàm lượng này ở trong bảng.');
      return;
    }
    if (!weight) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa nhập cân nặng.');
      return;
    }
    const selectedItem = this.selectedItem;
    const lieu = this.calculateDose(selectedItem.name, weight, selectedItem.doseMinimum, selectedItem.doseMaximum, selectedItem.selectedDoseOfTimeADay, selectedItem.value);
    const newItem = {
      ...selectedItem,
      weight: weight,
      lieuToiThieu: lieu.lieuToiThieu,
      lieuToiDa: lieu.lieuToiDa,
      order: this.viewModelSource.value.items.length + 1
    };

    this.viewModelSource.next({
      items: [...this.viewModelSource.value.items, newItem]
    });

    this.selectedItem = {};
  }

  calculateDose(name: string, weight: number, doseMinimum: number, doseMaximum: number, doseOfTimeADay: number, value: number): any {
    let lieu = {
      lieuToiDa: name === "Cefditoren" ? 4 : weight * doseMaximum / doseOfTimeADay / value,
      lieuToiThieu: weight * doseMinimum / doseOfTimeADay / value
    };

    if (lieu.lieuToiThieu > lieu.lieuToiDa) {
      lieu.lieuToiThieu = lieu.lieuToiDa;
    }

    lieu.lieuToiThieu = Math.round(lieu.lieuToiThieu * 100) / 100;
    lieu.lieuToiDa = Math.round(lieu.lieuToiDa * 100) / 100;

    return lieu;
  }

  deleteItem(item: any): void {
    const items = this.viewModelSource.value.items.filter((i: any) => i !== item);
    this.viewModelSource.next({
      items: items.map((it: any, index: number) => ({ ...it, order: index + 1 }))
    });
  }

  contentChanged() {
    this.getValueAndUnitByName();
  }

  getValueAndUnitByName(): void {
    const selectedItem = this.selectedItem;
    const selectedContent = selectedItem.contents.find((c: any) => c.name === selectedItem.selectedContent);
    if (selectedContent) {
      this.selectedItem.value = selectedContent.value;
      this.selectedItem.unit = selectedContent.unit;
    }
  }

  onChanged(item: any) {
    var lieu = this.calculateDose(item.name, item.weight, item.doseMinimum, item.doseMaximum, item.selectedDoseOfTimeADay, item.value);
    item.lieuToiThieu = lieu.lieuToiThieu;
    item.lieuToiDa = lieu.lieuToiDa;
  }

  closeModal() {
    this.dialogRef.close();
  }

}