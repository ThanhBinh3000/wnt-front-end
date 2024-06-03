import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {SpinnerService} from "./services/spinner.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'webnhathuoc';
  constructor(
    public loadingService: SpinnerService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit() {
    this.loadingService.loading$.subscribe((value) => {
      this.cdRef.detectChanges();
    });
  }
}
