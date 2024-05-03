import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class PhieuDichVuService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-medical','phieu-dich-vu');
  }


}