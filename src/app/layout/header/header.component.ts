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
  public storeName: string;
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    this.store = authService.getDepartment();
    this.storeName = this.store.name;
  }

  ngOnInit(): void {
  }

  onRegionChanged() {

  }

  onCityChanged() {

  }

  onWardChanged() {

  }
}
