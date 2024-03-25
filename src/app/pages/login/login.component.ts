import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {SpinnerService} from "../../services/spinner.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private loadingService: SpinnerService, private router: Router) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    this.authService.logout();
    // Lắng nghe sự kiện từ máy chủ Socket.IO
    // this.socket.on('login-qr', (data: any, ackFn: any) => {
    //   console.log('Received message from server:', data);
    //   ackFn("Received"); // Gửi ack
    // });
  }

  async login() {
    this.loadingService.show();
    let data = await this.authService.login(this.formGroup.value);
    if (data) {
      this.authService.saveToken(data.token);
      this.router.navigate(['management/home']).then(r => {
      });
      this.loadingService.hide();
    }
  }
}
