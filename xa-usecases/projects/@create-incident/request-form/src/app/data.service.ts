import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { CustomerDto } from 'projects/@create-sr/request-form/src/app/dtos/CustomerDTO';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) {}

  public getCustomers() {
    return this.xaservices
      .Http!.Get<Array<CustomerDto>>(`/api/cmdb/alpinecustomers`)
      .pipe(share());
  }

  public getCategory1() {
    return this.xaservices
      .Http!.Get<Array<any>>(`/api/sm9/category`)
      .pipe(share());
  }

  public getCategory2(category: string) {
    return this.xaservices
      .Http!.Get<Array<any>>(`/api/sm9/category/${category}`)
      .pipe(share());
  }

}
