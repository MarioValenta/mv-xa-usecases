import { Injectable, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras, UrlTree } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ContentUiService {

    public Header: ContentHeader;
    public Footer: ContentFooter;


    constructor(private location: Location, private router: Router) {

        this.ResetAll();

    }

    ResetAll() {
        if (this.Header) {
            this.Header.Dispose();
        }

        if (this.Footer) {
            this.Footer.Dispose();
        }

        this.Header = new ContentHeader();
        this.Footer = new ContentFooter();
        this.Footer.CloseButton.Clicked(() => this.NavigateBack());
    }

    NavigateBack() {
        this.location.back();
    }

    NavigateByUrl(url: string | UrlTree, extras?: NavigationExtras) {
        this.router.navigateByUrl(url, extras);
    }

    NavigateByRelativeUrl(url: string, extras?: NavigationExtras) {

        if (url.startsWith('/')) {
            url = url.substring(1);
        }

        this.router.navigateByUrl(`${this.location.path()}/${url}`, extras);
    }

    Navigate(commands: any[], extras?: NavigationExtras) {
        this.router.navigate(commands, extras);
    }

    NavigateRelative(commands: any[], extras?: NavigationExtras) {
        const url = commands.join('/');
        this.NavigateByRelativeUrl(url, extras);
    }

    ReplaceUrlPath(path: string, query?: string, state?: any) {
        this.location.replaceState(path, query, state);
    }

}

export class ButtonBehavior {

    public Text$: BehaviorSubject<string>;
    public Show$: BehaviorSubject<boolean>;
    public Enabled$: BehaviorSubject<boolean>;
    public Icon$: BehaviorSubject<string>;
    public Color$: BehaviorSubject<string>;

    public Loading$: BehaviorSubject<boolean>;

    public CustomClass$: BehaviorSubject<string>;

    private _clicked: () => void;

    constructor(private text: string = '', private show: boolean = false, private enabled: boolean = false) {
        this.Reset();
    }



    Reset() {
        this.Dispose();
        this.Text$ = new BehaviorSubject(this.text);
        this.Show$ = new BehaviorSubject(this.show);
        this.Enabled$ = new BehaviorSubject(this.enabled);
        this.Icon$ = new BehaviorSubject('');
        this.Color$ = new BehaviorSubject('');
        this.Loading$ = new BehaviorSubject(false);
        this.CustomClass$ = new BehaviorSubject(null);
    }

    private Dispose() {
        if (this.Text$) {
            this.Text$.complete();
        }

        if (this.Show$) {
            this.Show$.complete();
        }

        if (this.Enabled$) {
            this.Enabled$.complete();
        }

        this._clicked = null;


        if (this.Icon$) {
            this.Icon$.complete();
        }

        if (this.Color$) {
            this.Color$.complete();
        }
    }

    Text(value: string) {

        this.Text$.next(value);


    }

    Show(value?: boolean) {
        if (value == null || value === undefined) {
            value = true;
        }

        this.Show$.next(value);


    }

    Loading(value: boolean) {
        this.Loading$.next(value);
    }

    CustomClass(value: string) {
        this.CustomClass$.next(value);
    }

    set Enabled(value: boolean | string) {
        setTimeout(() => {
            if (typeof value === 'string') {
                if (value.toLocaleUpperCase() === 'VALID') {
                    this.Enabled$.next(true);
                } else {
                    this.Enabled$.next(false);
                }
            } else {
                this.Enabled$.next(value);
            }
        }, 0);


    }

    public Clicked(callback: () => void) {
        this._clicked = callback;
    }

    public Click() {
        if (this._clicked) {
            this._clicked();
        }

    }

    public set Icon(value: string) {

        this.Icon$.next(value);

    }

    public set Color(value: string) {

        this.Color$.next(value);

    }

}

class ContentHeader {

    public Show$: BehaviorSubject<boolean>;
    public Icon$: BehaviorSubject<string>;
    public Title$: BehaviorSubject<string>;
    public SubTitle$: BehaviorSubject<string>;

    public AddButton: ButtonBehavior;
    public RefreshButton: ButtonBehavior;
    public SaveButton: ButtonBehavior;

    public Menu$: BehaviorSubject<TemplateRef<any>>;

    constructor() {
        this.Title$ = new BehaviorSubject(null);
        this.SubTitle$ = new BehaviorSubject(null);
        this.Show$ = new BehaviorSubject(false);
        this.Icon$ = new BehaviorSubject('');

        this.AddButton = new ButtonBehavior('Add', false, true);
        this.AddButton.Icon = 'plus';
        this.RefreshButton = new ButtonBehavior('Refresh', false, true);
        this.SaveButton = new ButtonBehavior('', false, true);
        this.Menu$ = new BehaviorSubject(null);
    }

    public Dispose() {
        this.Title$.complete();
        this.SubTitle$.complete();
        this.Show$.complete();
        this.Icon$.complete();
        this.AddButton.Reset();
        this.RefreshButton.Reset();
        this.SaveButton.Reset();
    }

    set Show(value: boolean) {

        this.Show$.next(value);


    }

    set Title(value: string) {
        this.Title$.next(value);
    }

    set SubTitle(value: string) {
        this.SubTitle$.next(value);
    }

    set Icon(value: string) {

        this.Icon$.next(value);


    }


    SetMenu(template: TemplateRef<any>) {
        this.Menu$.next(template);
    }

}

class ContentFooter {
    public Show$: BehaviorSubject<boolean>;

    public SubmitButton: ButtonBehavior;
    public ApproveButton: ButtonBehavior;
    public RejectButton: ButtonBehavior;
    public CloseButton: ButtonBehavior;

    public SaveButton: ButtonBehavior;
    public FeedbackButton: ButtonBehavior;

    constructor() {
        this.Show$ = new BehaviorSubject(false);
        
        this.SubmitButton = new ButtonBehavior('Submit', true, false);
        this.SubmitButton.Color = 'green';
        this.SubmitButton.Icon = 'check';

        this.ApproveButton = new ButtonBehavior('Approve', false, true);
        this.ApproveButton.Color = 'green';
        this.ApproveButton.Icon = 'check';

        this.RejectButton = new ButtonBehavior('Reject', false, true);
        this.RejectButton.Color = 'red';
        this.RejectButton.Icon = 'ban';

        this.CloseButton = new ButtonBehavior('Close', true, true);
        this.CloseButton.Color = 'red';
        this.CloseButton.Icon = 'times';
        this.CloseButton.CustomClass('small ui button tertiary');

        this.SaveButton = new ButtonBehavior('Save', false, false);
        this.SaveButton.Color = 'orange';
        this.SaveButton.Icon = 'save outline';
        this.SaveButton.CustomClass('small ui button tertiary');

        this.FeedbackButton = new ButtonBehavior('Feedback', true, true);
        this.FeedbackButton.Color = 'feedbackbutton';
        this.FeedbackButton.Icon = 'comments';
        this.FeedbackButton.CustomClass('small ui button tertiary');

    }

    public Dispose() {
        this.Show$.complete();
        this.SubmitButton.Reset();
        this.CloseButton.Reset();
        this.SaveButton.Reset();
        this.FeedbackButton.Reset();
    }


    set Show(value: boolean) {

        this.Show$.next(value);


    }

}



