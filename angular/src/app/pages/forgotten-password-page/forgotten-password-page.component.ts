import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ErrorMessage } from '../../components/error-summary/error-summary.component';

@Component({
  selector: 'app-forgotten-password-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <app-error-summary [errors]="getErrorSummaryMessages()" />
      <h1 class="govuk-heading-xl" data-testid="forgotten-password-title">
        Forgot your password?
      </h1>
      <app-notification-banner
        *ngIf="formSubmitted"
        headerContent="Reset your password">
        Please check your email to reset your password
      </app-notification-banner>
      <form
        *ngIf="!formSubmitted"
        #forgotPasswordForm="ngForm"
        (ngSubmit)="onSubmit(forgotPasswordForm)">
        <p class="govuk-body">
          Enter your email address to request a password reset.
        </p>
        <div
          [ngClass]="
            isEmailValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="email" class="govuk-label"> Email address </label>
          <p
            *ngIf="!isEmailValid"
            data-testid="email-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Enter your email address
          </p>
          <input
            type="email"
            name="email"
            id="email"
            ngModel
            email
            required
            [ngClass]="
              isEmailValid
                ? 'govuk-input govuk-!-width-three-quarters'
                : 'govuk-input govuk-!-width-three-quarters govuk-input--error'
            "
            value=""
            aria-description="Enter your email address"
            autocomplete="email" />
        </div>
        <button
          type="submit"
          id="continue"
          class="govuk-button"
          data-module="govuk-button"
          data-prevent-double-click="true">
          Send
        </button>
      </form>
    </div>
  `,
})
export class ForgottenPasswordPageComponent {
  isEmailValid = true;
  formSubmitted = false;

  getErrorSummaryMessages() {
    let errors: ErrorMessage[] = [];

    if (!this.isEmailValid)
      errors.push({ elementId: '#email', message: 'Enter your email address' });

    return errors;
  }

  onSubmit(form: NgForm) {
    this.isEmailValid = !form.controls['email'].errors;

    if (!this.isEmailValid) return;

    const { email } = form.value;
    // TODO Call API
    this.formSubmitted = true;
  }
}
