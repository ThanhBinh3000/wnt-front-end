import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs/operators';
import {ResponseData} from "../models/response-data";
import {STATUS_CODE} from "../constants/config";

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
  ) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getToken();
    if (accessToken) {
      let headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${accessToken}`,
      );
      if (
        !request.url.includes('UploadFile') &&
        !request.url.includes('import') &&
        !request.url.includes('upload-attachment') &&
        !request.url.includes('upload')
      ) {
        headers = headers.append('content-type', 'application/json');
      }
      request = request.clone({
        headers,
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const result = event.body as ResponseData;
            if (result.status != 0) {
              // thông báo lỗi
            }
          }
        },
        (err: any) => {
          if (err.status === STATUS_CODE.UNAUTHORIZED) {
            // thông báo lỗi
            this.authService.logout();
          } else {
            // thông báo lỗi
          }
        },
      ),
    );
  }
}
