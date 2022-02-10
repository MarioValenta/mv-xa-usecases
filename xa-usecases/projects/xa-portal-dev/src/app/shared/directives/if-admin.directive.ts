import { Directive, ElementRef, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { environment } from '../../../environments/environment';



@Directive({
    selector: '[if-admin]'
})
export class IfAdminDirective {



    constructor(
        private element: ElementRef,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
    ) {
       
    }

    private checkPermission() {
        return true;
      }

    private updateView() {
        if (this.checkPermission()) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }

}
