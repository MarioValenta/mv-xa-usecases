import { TestBed, waitForAsync } from '@angular/core/testing';
import { RequestFormComponent } from './app.component';

describe('RequestFormComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestFormComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RequestFormComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'RequestForm'`, () => {
    const fixture = TestBed.createComponent(RequestFormComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('RequestForm');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(RequestFormComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to RequestForm!');
  });
});
