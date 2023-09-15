import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <a
      href="#main-content"
      class="govuk-skip-link"
      data-module="govuk-skip-link">
      Skip to main content
    </a>
    <app-header></app-header>
    <div class="govuk-width-container ">
      <app-back-link></app-back-link>
      <main class="govuk-main-wrapper " id="main-content" role="main">
        <div class="govuk-grid-row">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
    <app-footer></app-footer>
  `,
})
export class AppComponent {}
