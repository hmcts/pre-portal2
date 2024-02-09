import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-page',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <div class="app-cookies-page" data-module="app-cookies-page">
        <h1 class="govuk-heading-xl">Cookies</h1>
        <p class="govuk-body">
          <a href="/" class="govuk-link">Pre Recorded Evidence Service</a> puts
          small files (known as ‘cookies’) on your computer.
        </p>

        <p class="govuk-body">
          These cookies are used across the GOV.UK Design System website.
        </p>

        <p class="govuk-body">
          We only set cookies when JavaScript is running in your browser and
          you’ve accepted them. If you choose not to run Javascript, the
          information on this page will not apply to you.
        </p>

        <p class="govuk-body">
          Find out
          <a
            href="https://ico.org.uk/for-the-public/online/cookies"
            class="govuk-link"
            >how to manage cookies</a
          >
          from the Information Commissioner's Office.
        </p>

        <form class="js-cookies-page-form">
          <h2 class="govuk-heading-l govuk-!-margin-top-6">
            Essential cookies (strictly necessary)
          </h2>

          <p class="govuk-body">
            We use an essential cookie to remember when you accept or reject
            cookies on our website.
          </p>

          <table class="govuk-table">
            <caption class="govuk-table__caption">
              Essential cookies we use
            </caption>
            <thead class="govuk-table__head">
              <tr class="govuk-table__row">
                <th scope="col" class="govuk-table__header">Name</th>
                <th scope="col" class="govuk-table__header">Purpose</th>
                <th scope="col" class="govuk-table__header">Expires</th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th scope="row" class="govuk-table__header">example_cookie</th>
                <td class="govuk-table__cell">Example cookie purpose</td>
                <td class="govuk-table__cell">1 year</td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class CookiesPageComponent {}
