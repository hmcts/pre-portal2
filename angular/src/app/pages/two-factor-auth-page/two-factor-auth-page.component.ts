import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ErrorMessage } from '../../components/error-summary/error-summary.component';

@Component({
  selector: 'app-two-factor-auth-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <app-error-summary [errors]="getErrorSummaryMessages()" />
      <h1 class="govuk-heading-xl" data-testid="two-factor-auth-title">
        Enter security code
      </h1>
      <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
        <p class="govuk-body">Check your email for the security code.</p>
        <div
          [ngClass]="
            isCodeValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="code" class="govuk-label"> Code </label>
          <p
            *ngIf="!isCodeValid"
            data-testid="auth-code-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Enter your two factor authentication code
          </p>
          <input
            type="text"
            name="code"
            id="code"
            class="govuk-input govuk-!-width-three-quarters"
            value=""
            autocomplete="off"
            aria-description="Enter your two factor authentication code"
            ngModel
            required />
        </div>
        <button
          type="submit"
          id="continue"
          class="govuk-button"
          formnovalidate=""
          data-module="govuk-button"
          data-prevent-double-click="true">
          Verify
        </button>
      </form>
    </div>
  `,
  styles: [],
})
export class TwoFactorAuthPageComponent {
  isCodeValid = true;

  constructor(private router: Router) {}

  getErrorSummaryMessages() {
    let errors: ErrorMessage[] = [];

    if (!this.isCodeValid)
      errors.push({
        elementId: '#code',
        message: 'Enter your two factor authentication code',
      });

    return errors;
  }

  onSubmit(form: NgForm) {
    this.isCodeValid = !form.controls['code'].errors;

    if (!this.isCodeValid) return;

    const { code } = form.value;

    // TODO Call api
    this.router.navigate(['browse']);
  }
}
