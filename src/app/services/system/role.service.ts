import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'role');
  }
  searchListUserManagement(body: any) {
    const url = `/api/wnt-system/role/search-list-user-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  createSystem(body: any) {
    const url = `/api/wnt-system/role/create-user-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  updateSystem(body: any) {
    const url = `/api/wnt-system/role/update-user-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

 override create(body: any) {
    const url = `/api/wnt-system/role/create-staff-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  override update(body: any) {
    const url = `/api/wnt-system/role/update-staff-management`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
