import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  template: `
    <div
      class="govuk-cookie-banner"
      data-nosnippet
      role="region"
      aria-label="Cookies on Pre Recorded Evidence Service"
      *ngIf="!hideBanner">
      <div
        class="govuk-cookie-banner__message govuk-width-container"
        *ngIf="!showAcceptMessage && !showRejectMessage">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <h2 class="govuk-cookie-banner__heading govuk-heading-m">
              Cookies on Pre Recorded Evidence Service
            </h2>
            <div class="govuk-cookie-banner__content">
              <p class="govuk-body">
                We use some essential cookies to make this service work.
              </p>
              <p class="govuk-body">
                We’d like to set additional cookies so we can remember your
                settings, understand how people use the service and make
                improvements.
              </p>
            </div>
          </div>
        </div>
        <div class="govuk-button-group">
          <button
            value="yes"
            type="submit"
            name="cookies[additional]"
            class="govuk-button"
            data-module="govuk-button"
            (click)="acceptCookies()">
            Accept additional cookies
          </button>
          <button
            value="no"
            type="submit"
            name="cookies[additional]"
            class="govuk-button"
            data-module="govuk-button"
            (click)="rejectCookies()">
            Reject additional cookies
          </button>
          <a class="govuk-link" href="#">View cookies</a>
        </div>
      </div>
      <div
        class="govuk-cookie-banner__message govuk-width-container"
        [hidden]="!showAcceptMessage">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <div class="govuk-cookie-banner__content">
              <p class="govuk-body">
                You’ve accepted additional cookies. You can
                <a class="govuk-link" href="#">change your cookie settings</a>
                at any time.
              </p>
            </div>
          </div>
        </div>
        <div class="govuk-button-group">
          <button
            value="yes"
            type="submit"
            name="cookies[hide]"
            class="govuk-button"
            data-module="govuk-button"
            (click)="clearBanner()">
            Hide cookie message
          </button>
        </div>
      </div>
      <div
        class="govuk-cookie-banner__message govuk-width-container"
        [hidden]="!showRejectMessage">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <div class="govuk-cookie-banner__content">
              <p class="govuk-body">
                You’ve rejected additional cookies. You can
                <a class="govuk-link" href="#">change your cookie settings</a>
                at any time.
              </p>
            </div>
          </div>
        </div>
        <div class="govuk-button-group">
          <button
            value="yes"
            type="submit"
            name="cookies[hide]"
            class="govuk-button"
            data-module="govuk-button"
            (click)="clearBanner()">
            Hide cookie message
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CookieBannerComponent {
  hideBanner = false;
  showAcceptMessage = false;
  showRejectMessage = false;

  acceptCookies() {
    this.showAcceptMessage = true;
  }

  rejectCookies() {
    this.showRejectMessage = true;
  }

  clearBanner() {
    this.hideBanner = true;
  }
}
