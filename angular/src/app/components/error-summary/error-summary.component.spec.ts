import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';

import { ErrorSummaryComponent } from './error-summary.component';

describe('ErrorSummaryComponent', () => {
  let component: ErrorSummaryComponent;
  let fixture: ComponentFixture<ErrorSummaryComponent>;
  let viewportScrollerSpy: jasmine.SpyObj<ViewportScroller>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ViewportScroller', ['scrollToAnchor']);

    await TestBed.configureTestingModule({
      declarations: [ErrorSummaryComponent],
      providers: [{ provide: ViewportScroller, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorSummaryComponent);
    component = fixture.componentInstance;
    component.errors = [];
    viewportScrollerSpy = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error messages when there are errors and call scrollToAnchor when links are clicked', () => {
    component.errors = [
      { elementId: '#input1', message: 'Error message 1' },
      { elementId: '#input2', message: 'Error message 2' },
    ];
    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    const errorLinks = errorSummaryElement.querySelectorAll(
      '.govuk-error-summary__list a'
    );

    expect(errorSummaryElement).toBeTruthy();
    expect(errorLinks.length).toBe(2);
    expect(errorLinks[0].innerText).toContain('Error message 1');
    expect(errorLinks[0].getAttribute('href')).toBe('#input1');
    errorLinks[0].click();
    expect(viewportScrollerSpy.scrollToAnchor).toHaveBeenCalledWith('input1');

    expect(errorLinks[1].innerText).toContain('Error message 2');
    expect(errorLinks[1].getAttribute('href')).toBe('#input2');
    errorLinks[1].click();
    expect(viewportScrollerSpy.scrollToAnchor).toHaveBeenCalledWith('input2');
  });

  it('should not display error summary when there are no errors', () => {
    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );

    expect(errorSummaryElement).toBeFalsy();
  });
});
