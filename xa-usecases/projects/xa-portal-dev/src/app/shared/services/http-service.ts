import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

// import { AuthenticationService } from './authentication-service';
import { IHttpService, HttpOptions } from './i-http-service';
import { catchError } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';


@Injectable()
export class HttpService implements IHttpService {


    constructor(private http: HttpClient, private appConfig: AppConfigService) { //private auth: AuthenticationService,

    }

    prepareHeaders(headers?: HttpHeaders | { [header: string]: string | string[] }) {
        if (!headers) {
            headers = new HttpHeaders();
        }

        if (!(headers instanceof HttpHeaders)) {
            headers = new HttpHeaders(headers);
        }

        //headers = headers.set('Authorization', 'Bearer ' + this.auth.GetAccessToken());
        return headers;
    }

    prepareUrl(url: string) {

        if (!url.toLocaleLowerCase().startsWith('http')) {
            if (url.startsWith('/')) {
                url = url.substring(1);
            }
            url = `${this.appConfig.getConfig().apiBaseUrl}/${url}`;
        }

        return url;
    }

    prepareRequest(url: string, options: HttpOptions) {

        if (!options) {
            options = {};
        }

        options.headers = this.prepareHeaders(options.headers);


        return {
            url: this.prepareUrl(url),
            options: options
        };
    }


    public Get<T>(url: string, options?: HttpOptions): Observable<T> {

        const prep = this.prepareRequest(url, options);
        return this.http.get<T>(prep.url, prep.options)
            .pipe(
                catchError(this.handleError)
            );

    }

    public GetText(url: string, options?: HttpOptions): Observable<string> {

        const prep = this.prepareRequest(url, options);
        return this.http.get(prep.url, { ...prep.options, responseType: 'text' })
            .pipe(
                catchError(this.handleError)
            );

    }

    public GetRaw<T>(url: string, options?: HttpOptions): Observable<HttpResponse<T>> {

        const prep = this.prepareRequest(url, options);
        return this.http.get<T>(prep.url, { ...prep.options, observe: 'response' })
            .pipe(
                catchError(this.handleError)
            );

    }

    public Post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {

        const prep = this.prepareRequest(url, options);
        return this.http.post<T>(prep.url, body, prep.options)
            .pipe(
                catchError(this.handleError)
            );

    }

    public PostRaw<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>> {

        const prep = this.prepareRequest(url, options);
        return this.http.post<T>(prep.url, body, { ...prep.options, observe: 'response' })
            .pipe(
                catchError(this.handleError)
            );

    }

    public Put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {

        const prep = this.prepareRequest(url, options);
        return this.http.put<T>(prep.url, body, prep.options)
            .pipe(
                catchError(this.handleError)
            );

    }

    public PutRaw<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>> {

        const prep = this.prepareRequest(url, options);
        return this.http.put<T>(prep.url, body, { ...prep.options, observe: 'response' })
            .pipe(
                catchError(this.handleError)
            );

    }

    public Patch<T>(url: string, body: any, options?: HttpOptions): Observable<T> {

        const prep = this.prepareRequest(url, options);
        return this.http.patch<T>(prep.url, body, prep.options)
            .pipe(
                catchError(this.handleError)
            );

    }

    public PatchRaw<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>> {

        const prep = this.prepareRequest(url, options);
        return this.http.patch<T>(prep.url, body, { ...prep.options, observe: 'response' })
            .pipe(
                catchError(this.handleError)
            );

    }

    public Delete<T>(url: string, options?: HttpOptions): Observable<T> {
        const prep = this.prepareRequest(url, options);
        return this.http.delete<T>(prep.url, prep.options)
            .pipe(
                catchError(this.handleError)
            );
    }

    public DeleteRaw<T>(url: string, options?: HttpOptions): Observable<HttpResponse<T>> {
        const prep = this.prepareRequest(url, options);
        return this.http.delete<T>(prep.url, { ...prep.options, observe: 'response' })
            .pipe(
                catchError(this.handleError)
            );
    }


    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(error);
    };
}


