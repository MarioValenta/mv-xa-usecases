import { Directive, ElementRef, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { environment } from '../../../environments/environment';



@Directive({
    selector: '[if-prod]'
})
export class IfProdDirective {

    constructor(
        private element: ElementRef,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
    ) {
        if (environment.production) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
