import { Observable } from 'rxjs';
import { HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

export interface IHttpService {

    Get<T>(url: string, options?: HttpOptions): Observable<T>;
    GetText(url: string, options?: HttpOptions): Observable<string>;

    GetRaw<T>(url: string, options?: HttpOptions): Observable<HttpResponse<T>>;

    Post<T>(url: string, body: any, options?: HttpOptions): Observable<T>;

    PostRaw<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>>;

    Put<T>(url: string, body: any, options?: HttpOptions): Observable<T> ;

    PutRaw<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>>;

    Delete<T>(url: string, options?: HttpOptions): Observable<T>;

    DeleteRaw<T>(url: string, options?: HttpOptions): Observable<HttpResponse<T>>;

}

export interface HttpOptions {

    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    params?: HttpParams | {
        [param: string]: string | string[];
    };

}