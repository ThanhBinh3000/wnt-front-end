import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'general-store-mapping-dialog',
  templateUrl: './general-store-mapping-dialog.component.html',
  styleUrl: './general-store-mapping-dialog.component.css'
})
export class GeneralStoreMappingDialogComponent implements OnInit {
  @Input() drugStoreCode: string = '';
  
  constructor() {
  }

  ngOnInit() {
  }

}
