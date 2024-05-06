import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class DeviceService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  isMobile() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      return width <= 768;
    }
    return false;
  }

  isTablet() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      return width > 768 && width <= 1024;
    }
    return false;
  }

  isDesktop() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      return width > 1024;
    }
    return false;
  }
}
