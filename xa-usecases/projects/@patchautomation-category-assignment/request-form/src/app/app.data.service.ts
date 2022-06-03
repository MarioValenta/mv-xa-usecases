import { Injectable } from '@angular/core';
import { UseCaseBaseService } from 'projects/usecase-base-class/usecase-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService extends UseCaseBaseService {

  public getCustomers(): Observable<any[]> {
    return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/customer`);
  }
}
