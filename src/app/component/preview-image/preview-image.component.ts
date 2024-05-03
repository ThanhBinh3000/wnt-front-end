import {Component, Injector, Input, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ThuocService} from "../../services/products/thuoc.service";
import {NhomThuocService} from "../../services/products/nhom-thuoc.service";
import {DonViTinhService} from "../../services/products/don-vi-tinh.service";
import {WarehouseLocationService} from "../../services/products/warehouse-location-service";
import {ProductTypesService} from "../../services/products/product-types-service";
import {UploadFileService} from "../../services/file/upload-file.service";
import {LOAI_SAN_PHAM} from "../../constants/config";

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrl: './preview-image.component.css'
})
export class PreviewImageComponent implements OnInit {

  @Input() width: string = '0px';
  @Input() heigh: string = '0px';
  @Input() pathImage: string = '';

  imageData : any

  constructor(
    private uploadFileService : UploadFileService,
  ) {

  }

  ngOnInit(): void {
    if (this.pathImage) {
      this.uploadFileService.getUrl(this.pathImage).subscribe(response => {
        const blob = new Blob([response], {type: 'image/jpeg'});
        const reader = new FileReader();
        reader.onload = () => {
          this.imageData = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });
    }
  }
}
