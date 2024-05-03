import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class ReportDetailsBydayService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-report', 'report-detail');
  }

  DetailsByDay(body: any) {
    const url = `/api/wnt-report/report-detail/detailsbyday`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  Inoutdetailbyday(body: any) {
    const url = `/api/wnt-report/report-detail/inoutdetailbyday`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
