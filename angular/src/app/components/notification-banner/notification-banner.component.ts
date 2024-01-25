import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-banner',
  template: `
    <div
      class="govuk-notification-banner"
      role="region"
      aria-labelledby="govuk-notification-banner-title"
      data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2
          class="govuk-notification-banner__title"
          id="govuk-notification-banner-title">
          {{ headerContent }}
        </h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p data-testid="notification-banner-body" class="govuk-body">
          <ng-content />
        </p>
      </div>
    </div>
  `,
  styles: [],
})
export class NotificationBannerComponent {
  @Input() headerContent?: string;
}
