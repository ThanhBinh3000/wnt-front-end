import {Component, Injector, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {ThuocService} from "../../../services/products/thuoc.service";

@Component({
  selector: 'OperatingTarget',
  templateUrl: './OperatingTarget.component.html',
  styleUrls: ['./OperatingTarget.component.css'],
})
export class OperatingTargetComponent extends BaseComponent implements OnInit {
  title: string = "Đánh giá các tiêu chí vận hành";
  constructor(
    private titleService: Title,
    injector: Injector,
    private _service: ThuocService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],

    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  getTextIcon(mode: number) {
    const feedbackMessages: { [key: number]: string } = {
      1: "Chưa thực sự hiệu quả, nên cải thiện",
      2: "Hiệu quả, nên tiếp tục duy trì"
    };
    return (feedbackMessages[mode] || "Chưa hiệu quả, cần cải thiện");
  }

  getTooltipIcon(mode: number) {
    const feedbackMessages: { [key: number]: string } = {
      1: "Nên cải thiện",
      2: "Hiệu quả"
    };
    return (feedbackMessages[mode] || "Cần phải cải thiện");
  }

  getStyleColorIcon(mode: number) {
    const colorMapping: { [key: number]: string } = {
      1: "orange",
      2: "green"
    };
    return colorMapping[mode] || "red";
  }

  getClassIcon(mode: number) {
    const colorMapping: { [key: number]: string } = {
      1: "fa fa-exclamation-circle",
      2: "fa fa-check-circle"
    };
    return colorMapping[mode] || "fa fa-times-circle";
  }

  getStyleBar(value: number, rate: number, type: number): { [key: string]: string } {
    let width: number;
    switch (type) {
      case 1:
        width = value < 10 ? 10 : value;
        break;
      case 2:
        width = value === 0 ? 10 : (value <= 2 ? value * 10 : (value > 2 && value <= 20 ? value + 20 : value));
        break;
      case 3:
        width = value < 10 ? 10 : (value > 100 ? 100 : value);
        break;
      case 4:
        width = value / 1000 < 10 ? 10 : (value / 1000 > 100 ? 100 : value / 1000);
        break;
      case 5:
        width = value * 20 < 10 ? 10 : (value * 20 > 100 ? 100 : value * 20);
        break;
      case 6:
        width = value / 200000 < 10 ? 10 : (value / 200000 > 100 ? 100 : value / 200000);
        break;
      case 7:
        width = rate == 2 ? 100 : 50;
        break;
      default:
        width = 0;
        break;
    }
    const backgroundColor = rate === 2 ? 'green' : (rate === 1 ? 'orange' : 'red');
    return {
      'width': `${width}%`,
      'background-color': backgroundColor
    };
  }
}
