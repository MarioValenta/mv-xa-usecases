import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { CustomerInformationDto } from './dto/CustomerInformation';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }


    // Service function to fetch data for Customer dropdown box
    public getCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/getdebitor`).pipe(
            share()
        );
    }

    // Service function to fetch data for Settlement dropdown box
    public getSettlements() {
        return this.xaservices.Http!.Get<Array<string>>(`api/ranf/gettypeofsettlement`).pipe(
            share()
        );
    }

      // Service function to fetch data for TimePayment dropdown box
      public getTimeForPayment() {
        return this.xaservices.Http!.Get<Array<string>>(`api/ranf/timeforpayment`).pipe(
            share()
        );
    }

    // Service function to fetch data for BillingCycle dropdown box
    public getBillingCycle() {
        return this.xaservices.Http!.Get<Array<string>>(`api/ranf/getbillingcycle`).pipe(
            share()
        );
    }

    public GetCustomerInformation(customerDebitorId: string): Observable<CustomerInformationDto> {
        return this.xaservices.Http!.Get<CustomerInformationDto>(`api/ranf/GetCustomerInformation/${customerDebitorId}`).pipe(
            share()
        );
    }

    // // Service function to fetch data for Addresses dropdown box
    // public getAddresses(customer: string) {
    //     return this.xaservices.Http!.Get<Array<string>>(`api/ranf/getaddress/${customer}`).pipe(
    //         share()
    //     );
    // }

    // // Service function to fetch data for Accounts number dropdown box
    // public getAccountsNumbers(customer: string) {
    //     // TODO redo httpclient.get => xaservice.Http.Get
    //     // AND remove baseURL
    //     return this.xaservices.Http!.Get<Array<string>>(`api/ranf/accountnumbers/${customer}`).pipe(
    //         share()
    //     );
    // }

    // // Service function to fetch data for UID number input formControl
    // public getUIDNumber(customer: string) {
    //     return this.xaservices.Http!.Get<string>(`api/ranf/accountnumbers/getuidnumber/${customer}`).pipe(
    //         share()
    //     );
    // }

    /**
     * Method for Excel import - requires NPM module: https://www.npmjs.com/package/xlsx
     *
     * @param {string} buffer ArrayBuffer representation of the excel file
     * @param {number} startRow Starter row
     * @return {unknown[]}  {XLSX.AOA2SheetOpts}
     * @memberof DataService
     */
    public getDataFromExcelFile(buffer: ArrayBuffer, startRow: number = 0) {
        // read workbook
        const wb: XLSX.WorkBook = XLSX.read(buffer, { type: 'array' });

        // grab first sheet
        const wsName: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsName];

        // UPDATE: If the cell format should be notified (e.g. we want to have a number format with more decimal places) then here can be done
        // Formatting data
        /*         const cols = ws['!cols'];
                const rows = ws['!rows'];
                const range = XLSX.utils.decode_range(ws['!ref']);
                // TODO: do the column filtering here, because some cases excel sheet's range is not equal to the occupied/used cell coverage -> we should have fixed number of columns..
                // set the format to two decimal places
                const format = '0.00';
                // change cell format of range
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                        if (!cell || cell.t !== 'n') { continue; } // only format numeric cells
                        cell.z = format;
                    }
                }
         */
        // save data
        const data = (XLSX.utils.sheet_to_json(ws, { header: 1, range: startRow }));

        return data;
    }

}
