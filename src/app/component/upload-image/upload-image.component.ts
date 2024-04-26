import {Component, Injector, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseComponent} from "../base/base.component";
import {UploadFileService} from "../../services/file/upload-file.service";
@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css'
})
export class UploadImageComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service : UploadFileService,
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      file : []
    })
  }

  onFileSelected(event) {
    this.formData.patchValue({
      file: event.target.files[0] as File,
    });
    console.log(this.formData.value.file);
    this.previewImage();
  }

  onSubmit() {
    console.log(this.formData.value.file);
    this._service.upload(this.formData.value.file).then((res)=>{
      console.log(res)
    })
    // Gửi hình ảnh đến backend hoặc thực hiện xử lý tùy ý
  }

  previewImage() {
    // const reader = new FileReader();
    // reader.onload = (event) => {
    //   this.imageUrl = event.target?.result;
    // };
    // reader.readAsDataURL(this.selectedFile);
  }

  ngOnInit(): void {
  }
}
