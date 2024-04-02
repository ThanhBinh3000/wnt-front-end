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

  changePassword(body: any) {
    const url = `/api/wnt-system/nguoi-dung/change-password`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
