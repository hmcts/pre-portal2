import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { AppModule } from '../../app.module';
import { TwoFactorAuthPageComponent } from './two-factor-auth-page.component';
import { ErrorSummaryComponent } from '../../components/error-summary/error-summary.component';

describe('TwoFactorAuthPageComponent', () => {
  let component: TwoFactorAuthPageComponent;
  let fixture: ComponentFixture<TwoFactorAuthPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoFactorAuthPageComponent, ErrorSummaryComponent],
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoFactorAuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector(
      'h1[data-testid="two-factor-auth-title"]'
    );

    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Enter security code');
  });

  it('should show a code input field', () => {
    const codeInputField = fixture.nativeElement.querySelector('input#code');

    expect(codeInputField).toBeTruthy();
  });

  it('should display error message when code is invalid', () => {
    const form = {
      controls: { code: { errors: { required: true } } },
    } as unknown as NgForm;

    component.onSubmit(form);
    fixture.detectChanges();

    const codeErrorElement = fixture.nativeElement.querySelector(
      'p[data-testid="auth-code-error"]'
    );

    expect(codeErrorElement).toBeTruthy();
    expect(codeErrorElement.textContent.trim()).toBe(
      'Error: Enter your two factor authentication code'
    );
  });

  it('should display the error summary with a link to the code input when the code is invalid', () => {
    component.onSubmit({
      controls: {
        code: { errors: { required: true } },
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeTruthy();

    const errorSummaryLink = fixture.nativeElement.querySelector(
      'a[data-testid="error-summary-link"]'
    );
    expect(errorSummaryLink).toBeTruthy();
    expect(errorSummaryLink.getAttribute('href')).toBe('#code');
    expect(errorSummaryLink.textContent.trim()).toBe(
      'Enter your two factor authentication code'
    );
  });

  it('should not display error message when code is valid', () => {
    const form = {
      controls: { code: { errors: null } },
      value: { code: '12345' },
    } as unknown as NgForm;

    component.onSubmit(form);
    fixture.detectChanges();

    const codeErrorElement = fixture.nativeElement.querySelector(
      'p[data-testid="auth-code-error"]'
    );

    expect(codeErrorElement).toBeFalsy();
  });

  it('should not display an error summary when the code is valid', () => {
    component.onSubmit({
      controls: {
        code: { errors: null },
      },
      value: {
        code: 'TEST123',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeFalsy();
  });
});
