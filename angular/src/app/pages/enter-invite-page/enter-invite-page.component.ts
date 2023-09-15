import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ErrorMessage } from '../../components/error-summary/error-summary.component';

@Component({
  selector: 'app-enter-invite-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <app-error-summary
        [errors]="getErrorSummaryMessages()"></app-error-summary>
      <h1 class="govuk-heading-xl" data-testid="invite-code-title">
        Sign up with an invitation code
      </h1>
      <form
        #createAccountForm="ngForm"
        (ngSubmit)="onSubmit(createAccountForm)">
        <div
          [ngClass]="
            isCodeValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="code" class="govuk-label"> Invitation code </label>
          <p
            *ngIf="!isCodeValid"
            data-testid="invite-code-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Enter your invitation code
          </p>
          <input
            type="text"
            name="code"
            id="code"
            class="govuk-input govuk-!-width-three-quarters"
            value=""
            autocomplete="off"
            aria-description="Enter your invitation code"
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
          Register
        </button>
      </form>
    </div>
  `,
})
export class EnterInvitePageComponent {
  isCodeValid = true;

  constructor(private router: Router) {}

  getErrorSummaryMessages() {
    let errors: ErrorMessage[] = [];

    if (!this.isCodeValid)
      errors.push({
        elementId: '#code',
        message: 'Enter your invitation code',
      });

    return errors;
  }

  onSubmit(form: NgForm) {
    this.isCodeValid = !form.controls['code'].errors;

    if (!this.isCodeValid) return;

    const { code } = form.value;
    // TODO Call api

    this.router.navigate(['register']);
  }
}
