import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class EsDiagnoseService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-categories','esdiagnose');
  }
}
