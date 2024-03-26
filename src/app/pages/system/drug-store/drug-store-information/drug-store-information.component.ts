import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-drug-store-information',
  templateUrl: './drug-store-information.component.html',
  styleUrl: './drug-store-information.component.css'
})
export class DrugStoreInformationComponent implements OnInit {
  title: string = "CÔNG TY TNHH WEB NHÀ THUỐC";
  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
