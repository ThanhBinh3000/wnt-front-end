import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'criteria-business-dialog',
  templateUrl: './criteria-business-dialog.component.html',
  styleUrl: './criteria-business-dialog.component.css'
})
export class CriteriaBusinessDialogComponent implements OnInit {
  @Input() drugStoreCode: string = '';
  
  constructor() {
  }

  ngOnInit() {
  }

}

