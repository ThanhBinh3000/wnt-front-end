import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-reward-program-dialog',
  templateUrl: './supplier-reward-program-dialog.component.html',
  styleUrls: ['./supplier-reward-program-dialog.component.css'],
})
export class SupplierRewardProgramDialogComponent implements OnInit {
  @Input() supplierID: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}