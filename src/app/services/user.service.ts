import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";
import {UserLogin} from "../models/user-login";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {
  }

  getUserLogin() {
    return {} as UserLogin;
  }
}
