import { Component, Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';

export type ErrorMessage = {
  elementId: string;
  message: string;
};

@Component({
  selector: 'app-error-summary[errors]',
  template: `
    <div
      *ngIf="errors.length > 0"
      class="govuk-error-summary"
      data-module="govuk-error-summary">
      <div role="alert">
        <h2 class="govuk-error-summary__title">There is a problem</h2>
        <div class="govuk-error-summary__body">
          <ul class="govuk-list govuk-error-summary__list">
            <li *ngFor="let error of errors">
              <a
                data-testid="error-summary-link"
                [href]="error.elementId"
                (click)="onClick(error.elementId)"
                >{{ error.message }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class ErrorSummaryComponent {
  @Input() errors!: ErrorMessage[];

  constructor(private viewportScroller: ViewportScroller) {}

  onClick(elementId: string) {
    this.viewportScroller.scrollToAnchor(elementId.replace('#', ''));
    return false;
  }
}
