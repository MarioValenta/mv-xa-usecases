import { Injectable } from '@angular/core';
import { UseCaseBaseService } from 'projects/usecase-base-class/usecase-base.service';

@Injectable({
  providedIn: 'root'
})
export class DataService extends UseCaseBaseService {

  public getCatalogDbData(endpoint: string) {
    return this.xaservices.Http!.Get(endpoint);
  }

}
