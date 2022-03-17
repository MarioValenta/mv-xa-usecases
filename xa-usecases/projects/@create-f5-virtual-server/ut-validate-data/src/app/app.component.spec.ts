import { TestBed, waitForAsync } from '@angular/core/testing';
import { UTValidateComponent } from './app.component';

describe('UTValidateComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UTValidateComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(UTValidateComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ValidateRequestData'`, () => {
    const fixture = TestBed.createComponent(UTValidateComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ValidateRequestData');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(UTValidateComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ValidateRequestData!');
  });
});
