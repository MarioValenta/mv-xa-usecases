import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { XAModalPageContext } from '@xa/ui';
import { Subject } from 'rxjs';
import { AssetModalContext } from '../AssetModalContext';


@Component({
    templateUrl: './error-modal-component.html',
    styleUrls: ['./error-modal-component.scss']
})
export class ErrorModalComponent implements OnInit, OnDestroy {  

    destroy$ = new Subject<any>();
    formBuilder: any;

    constructor(public context: XAModalPageContext<AssetModalContext>) {

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.destroy$.complete();
    }

    setFocus(elementName: string) {
        this.Cancel();
        let inputField: HTMLInputElement = document.querySelector('[formcontrolname="'+elementName+'"]');
        if (inputField) {
            inputField.focus();
        }        
    }

    Cancel() {
        this.context.Close();     
    }

}