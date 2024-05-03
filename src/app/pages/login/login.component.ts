import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  title = 'ĐĂNG NHẬP';
  public formGroup: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private authService: AuthService,
    private router: Router,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
    this.authService.logout();
    // Lắng nghe sự kiện từ máy chủ Socket.IO
    // this.socket.on('login-qr', (data: any, ackFn: any) => {
    //   console.log('Received message from server:', data);
    //   ackFn("Received"); // Gửi ack
    // });
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
  }

  async login() {
    if (this.formGroup.valid) {
      let res = await this.authService.login(this.formGroup.value);
      if (res && res.statusCode == 0) {
        this.authService.saveToken(res.data.token);
        let profile = await this.authService.profile();
        if (profile && profile.statusCode == 0) {
          this.authService.saveUser(profile.data);
          if(profile.data.nhaThuoc){
            this.authService.saveNhaThuoc(profile.data.nhaThuoc);
          }
        }
        this.router.navigate(['management/home']).then(async r => {
        });
      }
    }
  }
}
