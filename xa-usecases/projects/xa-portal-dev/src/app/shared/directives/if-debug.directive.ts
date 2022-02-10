import { Directive, ElementRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { AppConfigService } from '../../app-config.service';



@Directive({
    selector: '[if-debug]'
})
export class IfDebugDirective {

    constructor(
        private element: ElementRef,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private appConfig: AppConfigService
    ) {
        if (appConfig.getConfig().debugMode) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
