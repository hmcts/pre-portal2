import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ErrorMessage } from '../../../components/error-summary/error-summary.component';

@Component({
  selector: 'app-terms-and-conditions-form',
  template: `
    <form
      data-testid="terms-conditions-form"
      #termsConditionsForm="ngForm"
      (ngSubmit)="onSubmit(termsConditionsForm)">
      <div
        [ngClass]="
          isFormValid
            ? 'govuk-form-group'
            : 'govuk-form-group govuk-form-group--error'
        ">
        <p *ngIf="!isFormValid" id="email-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">Error:</span>
          You must accept the terms and conditions to use this service.
        </p>
        <div class="govuk-checkboxes" data-module="govuk-checkboxes">
          <div class="govuk-checkboxes__item">
            <input
              class="govuk-checkboxes__input"
              id="agree"
              name="agree"
              type="checkbox"
              value="agree"
              ngModel
              required />
            <label class="govuk-label govuk-checkboxes__label" for="agree">
              I agree to these terms and conditions.
            </label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        id="continue"
        class="govuk-button"
        data-module="govuk-button"
        data-prevent-double-click="true">
        Continue
      </button>
    </form>
  `,
})
export class TermsAndConditionsFormComponent {
  @Output() errorMessageEvent = new EventEmitter<ErrorMessage[]>();

  isFormValid = true;

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    const { agree } = form.value;
    this.isFormValid = agree;

    if (!this.isFormValid) {
      this.errorMessageEvent.emit([
        {
          elementId: '#agree',
          message:
            'You must accept the terms and conditions to use this service.',
        },
      ]);
      return;
    }
    this.errorMessageEvent.emit([]);

    // TODO Call api
    this.router.navigate(['browse']);
  }
}
