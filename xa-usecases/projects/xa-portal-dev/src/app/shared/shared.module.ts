import { NgModule, ModuleWithProviders } from '@angular/core';
import { IfProdDirective, IfAdminDirective, IfDebugDirective, IfDevDirective, XAScrollbarDirective } from './directives';
import { HttpService } from './services';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        XAScrollbarDirective,
        IfDevDirective, IfProdDirective, IfAdminDirective, IfDebugDirective,
    ],
    imports: [
        HttpClientModule
    ],
    exports: [
        XAScrollbarDirective,
        IfDevDirective, IfProdDirective, IfAdminDirective, IfDebugDirective,
    ]

})
export class SharedModule {

    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                HttpService
            ]
        };
    }
}

