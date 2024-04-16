import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class ReportDetailsBydayService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-report', 'report-date');
  }

  searchPageNguoiQuanTamOA(body: any) {
    const url = `/api/wnt-report/report-date/report`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
