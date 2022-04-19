import { TestBed, waitForAsync } from '@angular/core/testing';
import { InputFormArrayComponent } from './input-forms-array.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputFormArrayComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(InputFormArrayComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'input-forms-array'`, () => {
    const fixture = TestBed.createComponent(InputFormArrayComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('input-forms-array');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(InputFormArrayComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('input-forms-array app is running!');
  });
});
