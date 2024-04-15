import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-categories','bank-account');
  }


}
