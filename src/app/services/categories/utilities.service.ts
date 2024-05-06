import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-categories', 'regions');
  }

  searchListTinhThanh(body: any) {
    const url = `/api/wnt-categories/regions/search-list`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListQuanHuyen(body: any) {
    const url = `/api/wnt-categories/cities/search-list`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListPhuongXa(body: any) {
    const url = `/api/wnt-categories/wards/search-list`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  updateThongTinKhuVuc(body: any) {
    let url = '';
    switch (body.controller) {
      case 'khach-hangs':
        url = `/api/wnt-customer/${body.controller}/update-thong-tin-khu-vuc`;
        break;
      case 'nha-thuocs':
      case 'nguoi-dung':
        url = `/api/wnt-system/${body.controller}/update-thong-tin-khu-vuc`;
        break;
    }
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
