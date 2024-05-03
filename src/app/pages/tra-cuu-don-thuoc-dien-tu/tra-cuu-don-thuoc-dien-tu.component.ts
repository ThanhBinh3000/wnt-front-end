import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-tra-cuu-don-thuoc-dien-tu',
  templateUrl: './tra-cuu-don-thuoc-dien-tu.component.html',
  styleUrls: ['./tra-cuu-don-thuoc-dien-tu.component.css'],
})
export class TraCuuDonThuocDienTuComponent implements OnInit, OnDestroy {
  title = 'Tra cứu đơn thuốc điện tử quốc gia';
  public formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.formGroup = this.fb.group({
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
  }
}
