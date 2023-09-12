import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { AppModule } from '../../app.module';
import { RegisterPageComponent } from './register-page.component';
import { NotificationBannerComponent } from '../../components/notification-banner/notification-banner.component';
import { DetailsComponent } from '../../components/details/details.component';
import { ErrorSummaryComponent } from '../../components/error-summary/error-summary.component';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RegisterPageComponent,
        NotificationBannerComponent,
        DetailsComponent,
        ErrorSummaryComponent,
      ],
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a notification banner with the correct header and body', () => {
    component.inviteCode = 'code12345';
    fixture.detectChanges();

    const navBanner = fixture.nativeElement.querySelector(
      '.govuk-notification-banner'
    );
    expect(navBanner).toBeTruthy();

    const navBannerHeader = fixture.nativeElement.querySelector(
      '.govuk-notification-banner__title'
    );
    expect(navBannerHeader).toBeTruthy();
    expect(navBannerHeader.textContent.trim()).toBe(
      'Redeeming Invitation Code'
    );

    const navBannerBody = fixture.nativeElement.querySelector(
      '[data-testid="notification-banner-body"]'
    );
    expect(navBannerBody).toBeTruthy();
    expect(navBannerBody.textContent.trim()).toBe('code12345');
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector('h1');
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Register your account');
  });

  it('should show an email input field', () => {
    const emailInputField = fixture.nativeElement.querySelector('input#email');

    expect(emailInputField).toBeTruthy();
  });

  it('should show a password input field', () => {
    const passwordInputField =
      fixture.nativeElement.querySelector('input#password');

    expect(passwordInputField).toBeTruthy();
  });

  it('should show a confirm password input field', () => {
    const passwordInputField = fixture.nativeElement.querySelector(
      'input#confirmPassword'
    );

    expect(passwordInputField).toBeTruthy();
  });

  it('should initialize with a valid password and confirm password', () => {
    expect(component.isPasswordValid).toBeTrue();
    expect(component.isConfirmPasswordValid).toBeTrue();
  });

  it('should display error messages when password is not set', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: { required: true } },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: '',
        confirmPassword: 'Password1!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement).toBeTruthy();
    expect(passwordErrorElement.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );

    const confirmPasswordErrorElement = fixture.nativeElement.querySelector(
      '#confirm-password-invalid-error'
    );

    expect(confirmPasswordErrorElement).toBeTruthy();
    expect(confirmPasswordErrorElement.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );
  });

  it('should display the error summary with a link to the password input when the password is not set', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: { required: true } },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: '',
        confirmPassword: '',
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
    expect(errorSummaryLink.getAttribute('href')).toBe('#password');
    expect(errorSummaryLink.textContent.trim()).toBe(
      'Password does not meet the minimum criteria'
    );
  });

  it('should display error messages when password is too short', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'test',
        confirmPassword: 'test',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement).toBeTruthy();
    expect(passwordErrorElement.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );

    const confirmPasswordErrorElement = fixture.nativeElement.querySelector(
      '#confirm-password-invalid-error'
    );

    expect(confirmPasswordErrorElement).toBeTruthy();
    expect(confirmPasswordErrorElement.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );
  });

  it('should display the error summary with a link to the password input when the password does not meet requirements', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: { required: true } },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: '',
        confirmPassword: '',
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
    expect(errorSummaryLink.getAttribute('href')).toBe('#password');
    expect(errorSummaryLink.textContent.trim()).toBe(
      'Password does not meet the minimum criteria'
    );
  });

  it('should display error messages when password does not meet enough requirements', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement).toBeTruthy();
    expect(passwordErrorElement.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );

    const confirmPasswordErrorElement = fixture.nativeElement.querySelector(
      '#confirm-password-invalid-error'
    );

    expect(confirmPasswordErrorElement).toBeTruthy();
    expect(confirmPasswordErrorElement.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );

    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement2 =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement2).toBeTruthy();
    expect(passwordErrorElement2.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );

    const confirmPasswordErrorElement2 = fixture.nativeElement.querySelector(
      '#confirm-password-invalid-error'
    );

    expect(confirmPasswordErrorElement2).toBeTruthy();
    expect(confirmPasswordErrorElement2.textContent.trim()).toBe(
      'Error: Password does not meet the minimum criteria'
    );
  });

  it('should not display error messages when password meets enough requirements', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement).toBeFalsy();

    const confirmPasswordErrorElement = fixture.nativeElement.querySelector(
      '#confirm-password-invalid-error'
    );

    expect(confirmPasswordErrorElement).toBeFalsy();

    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password!',
        confirmPassword: 'Password!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement2 =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement2).toBeFalsy();

    const confirmPasswordErrorElement2 = fixture.nativeElement.querySelector(
      '#confirm-password-error'
    );

    expect(confirmPasswordErrorElement2).toBeFalsy();

    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement3 =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement3).toBeFalsy();

    const confirmPasswordErrorElement3 = fixture.nativeElement.querySelector(
      '#confirm-password-error'
    );

    expect(confirmPasswordErrorElement3).toBeFalsy();
  });

  it('should display an error message when the password is valid but the password confirmation does not match the password', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password234!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(
      '#confirm-password-error'
    );

    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe(
      'Error: Passwords do not match'
    );
  });

  it('should display the error summary with a link to the confirm password input does not match the value in the password input', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password234!',
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
    expect(errorSummaryLink.getAttribute('href')).toBe('#confirmPassword');
    expect(errorSummaryLink.textContent.trim()).toBe('Passwords do not match');
  });

  it('should not display an error message when the password is valid and the password confirmation matches the password', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector(
      '#confirm-password-error'
    );

    expect(errorElement).toBeFalsy();
  });

  it('should not display the error summary when the password and confirm password fields are both valid', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
        confirmPassword: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeFalsy();
  });
});
