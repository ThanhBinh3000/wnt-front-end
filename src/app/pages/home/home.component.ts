import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  modalShow: string[] = [];

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.modalShow.push('thongBao');

  }

  logOut() {
  }

  openModal(modalName: string) {
    this.modalShow.push(modalName);
  }

  closeModal(modalName: string) {
    this.modalShow = this.modalShow.filter(item => item !== modalName);
  }

  isShowModal(modalName: string) {
    return this.modalShow.includes(modalName);
  }
}
