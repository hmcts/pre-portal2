import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { AppModule } from '../../app.module';
import { LoginPageComponent } from './login-page.component';
import { ErrorSummaryComponent } from '../../components/error-summary/error-summary.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent, ErrorSummaryComponent],
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector('h1');
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Sign in');
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

  it('should initialize with valid email and password', () => {
    expect(component.isEmailValid).toBeTrue();
    expect(component.isPasswordValid).toBeTrue();
  });

  it('should display an error message when email is invalid', () => {
    component.onSubmit({
      controls: {
        email: { errors: { required: true } },
        password: { errors: null },
      },
      value: {
        email: '',
        password: '',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const emailErrorElement =
      fixture.nativeElement.querySelector('#email-error');

    expect(emailErrorElement).toBeTruthy();
    expect(emailErrorElement.textContent.trim()).toBe(
      'Error: Enter your email address'
    );
  });

  it('should display the error summary with a link to the email input when email is invalid', () => {
    component.onSubmit({
      controls: {
        email: { errors: { required: true } },
        password: { errors: null },
      },
      value: {
        email: '',
        password: '',
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

  it('should display an error message when password is invalid', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: { required: true } },
      },
      value: {
        email: '',
        password: '',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement).toBeTruthy();
    expect(passwordErrorElement.textContent.trim()).toBe(
      'Error: Enter your password'
    );
  });

  it('should display the error summary with a link to the password input when password is invalid', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: { required: true } },
      },
      value: {
        email: '',
        password: '',
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
    expect(errorSummaryLink.textContent.trim()).toBe('Enter your password');
  });

  it('should not display an error message when email is valid', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: { required: true } },
      },
      value: {
        email: '',
        password: '',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const emailErrorElement =
      fixture.nativeElement.querySelector('#email-error');

    expect(emailErrorElement).toBeFalsy();
  });

  it('should not display an error message password is valid', () => {
    component.onSubmit({
      controls: {
        email: { errors: { required: true } },
        password: { errors: null },
      },
      value: {
        email: '',
        password: 'Password123!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const passwordErrorElement =
      fixture.nativeElement.querySelector('#password-error');

    expect(passwordErrorElement).toBeFalsy();
  });

  it('should not display an error summary when both the email and the password are valid', () => {
    component.onSubmit({
      controls: {
        email: { errors: null },
        password: { errors: null },
      },
      value: {
        email: 'test@test.com',
        password: 'Password123!',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeFalsy();
  });
});
