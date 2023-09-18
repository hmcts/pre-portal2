import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl govuk-!-margin-bottom-8">Page not found</h1>
      <p class="govuk-body">
        If you entered a web address, check it is correct.
      </p>
      <p class="govuk-body">
        You can
        <a class="govuk-link" href="/">browse from the homepage</a>.
      </p>
      <pre class="govuk-!-margin-top-8">Status code: 404</pre>
    </div>
  `,
})
export class NotFoundPageComponent {}
