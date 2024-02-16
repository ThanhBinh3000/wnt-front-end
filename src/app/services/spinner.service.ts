import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {
  }

  show() {

  }

  hide() {

  }
}
