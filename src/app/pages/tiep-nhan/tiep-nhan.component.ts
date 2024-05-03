import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-tiep-nhan',
  templateUrl: './tiep-nhan.component.html',
  styleUrls: ['./tiep-nhan.component.css'],
})
export class TiepNhanComponent implements OnInit {
  title = 'Tiếp nhận yêu cầu hỗ trợ';
  public formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
  ) {
    this.formGroup = this.fb.group({
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
