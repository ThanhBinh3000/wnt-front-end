import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from './storage.service';
import {STORAGE_KEY} from '../constants/config';
import {ResponseData} from "../models/response-data";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(private router: Router, private storageService: StorageService, httpClient: HttpClient) {
    super(httpClient, 'wnt-security', '');
  }

  saveToken(token: string) {
    return this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, token);
  }

  getToken(): string {
    // @ts-ignore
    return JSON.parse(this.storageService.getString(STORAGE_KEY.ACCESS_TOKEN));
  }

  saveUser(user: any) {
    return this.storageService.set(STORAGE_KEY.USER_INFO, user);
  }

  getUser() {
    return this.storageService.get(STORAGE_KEY.USER_INFO);
  }

  getNhaThuoc() {
    return JSON.parse(this.storageService.get(STORAGE_KEY.NHA_THUOC));
  }

  saveRole(role: number) {
    return this.storageService.set(STORAGE_KEY.ROLE, role);
  }

  getRole(): number {
    return this.storageService.get(STORAGE_KEY.ROLE);
  }

  login(body: any) {
    const url = `/api/wnt-security/login`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  chooseNhaThuoc(body: any) {
    const url = `/api/wnt-security/choose-nha-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  isLogin() {
    return (!(this.getUser() == null || this.getUser() == undefined));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']).then(r => {
    });
  }
}
