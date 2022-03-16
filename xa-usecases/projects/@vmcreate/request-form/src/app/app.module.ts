import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { VmdkStorageLinuxComponent } from './vmdk-storage-linux.component';
import { VmdkStorageWindowsComponent } from './vmdk-storage-windows.component';
import { VMCreateRequestComponent } from './vm-create-request.component';
import { XAUIModule } from '@xa/ui';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { XAServices } from '@xa/lib-ui-common';
import { ShowErrorsModule } from '@xa/show-errors';

@NgModule({
    declarations: [
        VMCreateRequestComponent,
        VmdkStorageLinuxComponent,
        VmdkStorageWindowsComponent
    ],
    imports: [
        BrowserModule,
        XAUIModule,
        ReactiveFormsModule,
        FormsModule,
        NouisliderModule,
        ShowErrorsModule
    ],
    exports: [VMCreateRequestComponent],
    providers: [
        {
            provide: XAServices,
            useValue: (window as any).xa
        }
    ],
    entryComponents: [VMCreateRequestComponent],
    bootstrap: []
})
export class VMCreateRequestFormAppModule {

    constructor(private injector: Injector) {

    }
    ngDoBootstrap() {
        const ce = createCustomElement(VMCreateRequestComponent, { injector: this.injector });
        customElements.define('vm-create-request-form', ce);
    }
}
