import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SocketService} from "./socket.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(private fb: FormBuilder, private socket: SocketService) {
    this.formGroup = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
    this.socket.connect(); // Kết nối với máy chủ Socket.IO khi ứng dụng được khởi chạy
  }

  ngOnInit() {
    // Lắng nghe sự kiện từ máy chủ Socket.IO
    this.socket.on('login-qr', (data, ackFn) => {
      console.log('Received message from server:', data);
      ackFn("Received"); // Gửi ack
    });
  }

  login() {
    console.log(this.formGroup.value)
  }
}
