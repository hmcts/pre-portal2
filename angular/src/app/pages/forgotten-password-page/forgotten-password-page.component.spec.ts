import { FormsModule, NgForm } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgottenPasswordPageComponent } from './forgotten-password-page.component';
import { ErrorSummaryComponent } from '../../components/error-summary/error-summary.component';
import { NotificationBannerComponent } from '../../components/notification-banner/notification-banner.component';

describe('ForgottenPasswordPageComponent', () => {
  let component: ForgottenPasswordPageComponent;
  let fixture: ComponentFixture<ForgottenPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ForgottenPasswordPageComponent,
        ErrorSummaryComponent,
        NotificationBannerComponent,
      ],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgottenPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector(
      'h1[data-testid="forgotten-password-title"]'
    );

    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Forgot your password?');
  });

  it('should show an email input field', () => {
    const emailInputField = fixture.nativeElement.querySelector('input#email');

    expect(emailInputField).toBeTruthy();
  });

  it('should display error message when email is invalid', () => {
    const form = {
      controls: { email: { errors: { required: true, email: true } } },
    } as unknown as NgForm;

    component.onSubmit(form);
    fixture.detectChanges();

    const emailErrorElement = fixture.nativeElement.querySelector(
      'p[data-testid="email-error"]'
    );

    expect(emailErrorElement).toBeTruthy();
    expect(emailErrorElement.textContent.trim()).toBe(
      'Error: Enter your email address'
    );
  });

  it('should display the error summary with a link to the email input when email is invalid', () => {
    component.onSubmit({
      controls: {
        email: { errors: { required: true } },
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
    expect(errorSummaryLink.getAttribute('href')).toBe('#email');
    expect(errorSummaryLink.textContent.trim()).toBe(
      'Enter your email address'
    );
  });

  it('should not display error message when email is valid', () => {
    const form = {
      controls: { email: { errors: null } },
      value: { email: 'test@example.com' },
    } as unknown as NgForm;

    component.onSubmit(form);
    fixture.detectChanges();

    const emailErrorElement = fixture.nativeElement.querySelector(
      'p[data-testid="email-error"]'
    );

    expect(emailErrorElement).toBeFalsy();
  });

  it('should not display an error summary when the email is valid', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
      },
      value: {
        email: 'test@test.com',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeFalsy();
  });

  it('should not display a notification banner until the form is successfully submitted', () => {
    let notificationElement = fixture.nativeElement.querySelector(
      'app-notification-banner'
    );
    expect(notificationElement).toBeFalsy();

    component.onSubmit({
      controls: {
        email: { errors: null },
      },
      value: {
        email: 'test@test.com',
      },
    } as unknown as NgForm);
    fixture.detectChanges();

    notificationElement = fixture.nativeElement.querySelector(
      'app-notification-banner'
    );
    const notificationTitleElement = fixture.nativeElement.querySelector(
      '.govuk-notification-banner__title'
    );
    const notificationBodyElement = fixture.nativeElement.querySelector(
      '.govuk-notification-banner__content'
    );

    expect(notificationElement).toBeTruthy();

    expect(notificationTitleElement).toBeTruthy();
    expect(notificationTitleElement.textContent.trim()).toBe(
      'Reset your password'
    );

    expect(notificationBodyElement).toBeTruthy();
    expect(notificationBodyElement.textContent.trim()).toBe(
      'Please check your email to reset your password'
    );
  });

  it('should display the form element until the form is successfully submitted', () => {
    let formElement = fixture.nativeElement.querySelector('form');

    expect(formElement).toBeTruthy();

    component.onSubmit({
      controls: {
        email: { errors: null },
      },
      value: {
        email: 'test@test.com',
      },
    } as unknown as NgForm);
    fixture.detectChanges();

    formElement = fixture.nativeElement.querySelector('form');

    expect(formElement).toBeFalsy();
  });
});
