import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ErrorMessage } from '../../components/error-summary/error-summary.component';
import { validatePassword } from '../../helpers/validate-password';

@Component({
  selector: 'app-register-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <app-notification-banner headerContent="Redeeming Invitation Code">
        {{ inviteCode }}
      </app-notification-banner>

      <h1 class="govuk-heading-xl">Register your account</h1>
      <app-error-summary [errors]="getErrorSummaryMessages()" />
      <form #registerForm="ngForm" (ngSubmit)="onSubmit(registerForm)">
        <div class="govuk-form-group">
          <label for="email" class="govuk-label"> Email </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            email
            [(ngModel)]="userEmail"
            disabled
            class="govuk-input govuk-!-width-three-quarters"
            aria-description="Enter your email address" />
        </div>
        <div
          [ngClass]="
            isPasswordValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="password" class="govuk-label"> Password </label>
          <app-details title="Password criteria">
            Passwords must have at least 8 characters. <br />
            Passwords must contain characters from at least three of the
            following four classes: uppercase, lowercase, digit, and
            non-alphanumeric (special).
          </app-details>
          <p
            *ngIf="!isPasswordValid"
            id="password-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Password does not meet the minimum criteria
          </p>
          <input
            type="password"
            name="password"
            id="password"
            required
            ngModel
            [ngClass]="
              isPasswordValid
                ? 'govuk-input govuk-!-width-three-quarters'
                : 'govuk-input govuk-!-width-three-quarters govuk-input--error'
            "
            aria-description="Enter your new password" />
        </div>
        <div
          [ngClass]="
            isConfirmPasswordValid && isPasswordValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="confirmPassword" class="govuk-label">
            Confirm Password
          </label>
          <p
            *ngIf="!isPasswordValid"
            id="confirm-password-invalid-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Password does not meet the minimum criteria
          </p>
          <p
            *ngIf="!isConfirmPasswordValid"
            id="confirm-password-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Passwords do not match
          </p>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            ngModel
            [ngClass]="
              isConfirmPasswordValid
                ? 'govuk-input govuk-!-width-three-quarters'
                : 'govuk-input govuk-!-width-three-quarters govuk-input--error'
            "
            aria-description="Confirm your new password" />
        </div>
        <button
          type="submit"
          id="continue"
          class="govuk-button"
          data-module="govuk-button"
          data-prevent-double-click="true">
          Register
        </button>
      </form>
    </div>
  `,
})
export class RegisterPageComponent {
  isPasswordValid = true;
  isConfirmPasswordValid = true;

  // TODO Get email related to invite code
  userEmail = 'test@test.com';
  inviteCode = 'code12345';

  constructor(private router: Router) {}

  getErrorSummaryMessages() {
    let errors: ErrorMessage[] = [];

    if (!this.isPasswordValid)
      errors.push({
        elementId: '#password',
        message: 'Password does not meet the minimum criteria',
      });

    if (!this.isConfirmPasswordValid)
      errors.push({
        elementId: '#confirmPassword',
        message: 'Passwords do not match',
      });

    return errors;
  }

  onSubmit(form: NgForm) {
    const { email, password, confirmPassword } = form.value;

    this.isPasswordValid =
      !form.controls['password'].errors && validatePassword(password);
    this.isConfirmPasswordValid = password === confirmPassword;

    if (!this.isPasswordValid || !this.isConfirmPasswordValid) return;

    // TODO Call api
    this.router.navigate(['register', 'terms-and-conditions']);
  }
}
