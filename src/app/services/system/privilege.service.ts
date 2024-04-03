import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'privilege');
  }
}
