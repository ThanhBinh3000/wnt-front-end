import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search-drug',
  templateUrl: './search-drug.component.html',
  styleUrl: './search-drug.component.css'
})
export class SearchDrugComponent implements OnInit {
  title: string = "Tra cứu thông tin thuốc & mua hàng";

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

}
