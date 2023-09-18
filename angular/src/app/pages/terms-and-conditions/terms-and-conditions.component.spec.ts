import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { TermsAndConditionsFormComponent } from './terms-and-conditions-form/terms-and-conditions-form.component';
import { ErrorSummaryComponent } from '../../components/error-summary/error-summary.component';

describe('TermsAndConditionsComponent', () => {
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;

  const registerTCsRoute = [
    { path: 'register' },
    { path: 'terms-and-conditions' },
  ];
  const tcsRoute = [{ path: 'terms-and-conditions' }];
  let currentRoute: { path: string }[];

  beforeEach(async () => {
    currentRoute = tcsRoute;
    await TestBed.configureTestingModule({
      declarations: [
        TermsAndConditionsComponent,
        TermsAndConditionsFormComponent,
        ErrorSummaryComponent,
      ],
      imports: [FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            url: {
              subscribe: (fn: (value: any) => void) => {
                fn(currentRoute);
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector('h1');

    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe(
      'Pre-Recorded Evidence (PRE) Service'
    );
  });

  it('should initialize isForm to false', () => {
    expect(component.isForm).toBeFalse();
  });

  it('should render the form when isForm is true', () => {
    currentRoute = registerTCsRoute;
    component.isForm = true;
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(
        'form[data-testid="terms-conditions-form"]'
      )
    ).toBeTruthy();
  });

  it('should not render the form when isForm is false', () => {
    expect(
      fixture.nativeElement.querySelector('app-terms-and-conditions-form')
    ).toBeFalsy();
  });

  it('should set errorMessages when setSummaryErrorMessages is called', () => {
    const errorMessages = [
      { elementId: 'element1', message: 'Error 1' },
      { elementId: 'element2', message: 'Error 2' },
    ];

    component.setSummaryErrorMessages(errorMessages);
    fixture.detectChanges();

    expect(component.errorMessages).toEqual(errorMessages);
  });
});
