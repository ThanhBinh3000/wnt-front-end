import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'nguoi-dung');
  }

  searchPageUserManagement(body: any) {
    const url = `/api/wnt-system/nguoi-dung/search-page-user-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageStaffManagement(body: any) {
    const url = `/api/wnt-system/nguoi-dung/search-page-staff-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  createUser(body: any) {
    const url = `/api/wnt-system/nguoi-dung/create-user`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  updateUser(body: any) {
    const url = `/api/wnt-system/nguoi-dung/update-user`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  createStaff(body: any) {
    const url = `/api/wnt-system/nguoi-dung/create-staff`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  updateStaff(body: any) {
    const url = `/api/wnt-system/nguoi-dung/update-staff`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  changePassword(body: any) {
    const url = `/api/wnt-system/nguoi-dung/change-password`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  resetPassword(body: any) {
    const url = `/api/wnt-system/nguoi-dung/reset-password`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
