import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class ReportDetailsBydayService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-report', 'report-details-byday');

  }
}
