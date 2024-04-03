import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class RolePrivilegeService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'role-privilege');
  }
}
