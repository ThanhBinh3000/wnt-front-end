import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public store: any;
  public storeName: string = '';
  public display: any = {};

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    this.store = authService.getNhaThuoc();
    if (this.store) {
      this.storeName = this.store.name;
    }
  }

  ngOnInit(): void {
  }

  onRegionChanged() {

  }

  onCityChanged() {

  }

  onWardChanged() {

  }

  mouseEnter(key: string, property: string) {
    this.display[key] = property;
  }

  mouseLeave(key: string, property: string) {
    this.display[key] = property;
  }

  isDisplay(key: string) {
    if (!this.display[key]) {
      return 'none';
    }
    return this.display[key];
  }

  getFullName(){
    return this.authService.getUser().fullName;
  }
}
