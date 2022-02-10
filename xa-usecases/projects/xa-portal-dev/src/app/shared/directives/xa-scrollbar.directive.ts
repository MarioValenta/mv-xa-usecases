import { Directive, ElementRef, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import * as Scrollbar from 'overlayscrollbars';
@Directive({
    selector: '[xaScrollbar]'
})
export class XAScrollbarDirective implements OnInit {


    @Input() xaScrollbar = {};

    constructor(private elementRef: ElementRef) {

    }

    ngOnInit() {
        Scrollbar(this.elementRef.nativeElement, this.xaScrollbar);
    }

}
