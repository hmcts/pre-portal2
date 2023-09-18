import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details[title]',
  template: `
    <details class="govuk-details" data-module="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text"> {{ title }} </span>
      </summary>
      <div class="govuk-details__text">
        <ng-content></ng-content>
      </div>
    </details>
  `,
})
export class DetailsComponent {
  @Input() title!: string;
}
