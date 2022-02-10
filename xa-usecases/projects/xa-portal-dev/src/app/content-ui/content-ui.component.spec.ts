import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentUiComponent } from './content-ui.component';

describe('ContentUiComponent', () => {
  let component: ContentUiComponent;
  let fixture: ComponentFixture<ContentUiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
