import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './staff-permission.component.html',
  styleUrls: ['./staff-permission.component.css'],
})
export class StaffPermissionComponent implements OnInit {
  public display: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  mouseEnter(key: string, property: string) {
    this.display[key] = property;
  }

  mouseLeave(key: string, property: string) {
    this.display[key] = property;
  }

  isDisplay(key: string) {
    if(!this.display[key]){
      return 'none';
    }
    return this.display[key];
  }
}
