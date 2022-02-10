import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppHtmlFormsComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppHtmlFormsComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppHtmlFormsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'HtmlForms'`, () => {
    const fixture = TestBed.createComponent(AppHtmlFormsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('HtmlForms');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppHtmlFormsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('HtmlForms app is running!');
  });
});
