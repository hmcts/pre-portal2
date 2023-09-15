import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ErrorMessage } from '../../components/error-summary/error-summary.component';
import { validatePassword } from '../../helpers/validate-password';

@Component({
  selector: 'app-login-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <app-error-summary
        [errors]="getErrorSummaryMessages()"></app-error-summary>
      <h1 class="govuk-heading-xl">Sign in</h1>
      <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
        <div
          [ngClass]="
            isEmailValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="email" class="govuk-label" aria-describedby="email-hint">
            Email
          </label>
          <p *ngIf="!isEmailValid" id="email-error" class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Enter your email address
          </p>
          <input
            type="email"
            name="email"
            id="email"
            required
            email
            ngModel
            [ngClass]="
              isEmailValid
                ? 'govuk-input govuk-!-width-three-quarters'
                : 'govuk-input govuk-!-width-three-quarters govuk-input--error'
            "
            value=""
            aria-description="Enter your email address"
            autocomplete="email" />
        </div>
        <div
          [ngClass]="
            isPasswordValid
              ? 'govuk-form-group'
              : 'govuk-form-group govuk-form-group--error'
          ">
          <label for="password" class="govuk-label"> Password </label>
          <p
            *ngIf="!isPasswordValid"
            id="password-error"
            class="govuk-error-message">
            <span class="govuk-visually-hidden">Error:</span>
            Enter your password
          </p>

          <app-details title="Password criteria">
            Passwords must have at least 8 characters. <br />
            Passwords must contain characters from at least three of the
            following four classes: uppercase, lowercase, digit, and
            non-alphanumeric (special).
          </app-details>

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
            aria-description="Enter your password"
            autocomplete="current-password" />
        </div>
        <input type="hidden" name="profile" />
        <button
          type="submit"
          id="continue"
          class="govuk-button"
          data-module="govuk-button"
          data-prevent-double-click="true">
          Sign in
        </button>
      </form>
      <h2 class="govuk-heading-m">Problems signing in</h2>
      <ul class="govuk-list">
        <li>
          <a
            class="govuk-link"
            routerLink="/forgot-password"
            id="forgotten-password">
            I have forgotten my password
          </a>
        </li>
      </ul>

      <hr />
      <app-details title="Redeem invitation">
        <a routerLink="enter-invitation">Sign up with an invitation code</a>
      </app-details>
    </div>
  `,
  styles: [],
})
export class LoginPageComponent {
  isEmailValid = true;
  isPasswordValid = true;

  constructor(private router: Router) {}

  getErrorSummaryMessages() {
    let errors: ErrorMessage[] = [];

    if (!this.isEmailValid)
      errors.push({ elementId: '#email', message: 'Enter your email address' });

    if (!this.isPasswordValid)
      errors.push({ elementId: '#password', message: 'Enter your password' });

    return errors;
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    this.isEmailValid = !form.controls['email'].errors;
    this.isPasswordValid =
      !form.controls['password'].errors && validatePassword(password);

    if (!this.isEmailValid || !this.isPasswordValid) return;

    // TODO Call api

    this.router.navigate(['two-factor-auth']);
  }
}
