import { TestBed, waitForAsync } from '@angular/core/testing';
import { OracleDbRdnUTEnterStorageAppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OracleDbRdnUTEnterStorageAppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(OracleDbRdnUTEnterStorageAppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'enter-storage'`, () => {
    const fixture = TestBed.createComponent(OracleDbRdnUTEnterStorageAppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('enter-storage');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(OracleDbRdnUTEnterStorageAppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('enter-storage app is running!');
  });
});
