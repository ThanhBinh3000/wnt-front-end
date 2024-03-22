import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-system',
  templateUrl: './account-manager.component.html',
  styleUrl: './account-manager.component.css'
})
export class AccountManagerComponent implements OnInit {
  title: string = "Quản lý tài khoản người dùng";
  userId: number = 0;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  onDisplayData(){

  }
  onAddAccount(){

  }
  onEditAccount(){
     alert('edit');
  }
  onResetPassword(){

  }
  onDeleteAccount(){

  }
}
