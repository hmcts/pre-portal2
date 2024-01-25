import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ErrorMessage } from '../../components/error-summary/error-summary.component';

@Component({
  selector: 'app-terms-and-conditions',
  template: `
    <div class="govuk-grid-column-two-thirds">
      <app-error-summary [errors]="errorMessages" />
      <h1 class="govuk-heading-xl">Pre-Recorded Evidence (PRE) Service</h1>

      <p class="govuk-body-l">
        Terms &amp; Conditions (including Acceptable Use) for the Section 28
        Video on Demand Portal
        <br />
        (All Users)
        <br />
        <br />
        <strong>July 2022</strong>
      </p>

      <h2 class="govuk-heading-l">Introduction</h2>
      <p class="govuk-body">
        This PRE Service is provided by HM Courts and Tribunals Service (HMCTS)
        Unauthorised use is a criminal offence under the Computer Misuse Act
        1990, and you should disconnect immediately if you have not been
        authorised to use this system. Unauthorised access is prevented by two
        factor authentication.
      </p>
      <p class="govuk-body">
        The PRE Service provides access to pre-recorded cross examination
        recordings. It is supplied to individual users (The User) in accordance
        with the following Terms &amp; Conditions.
      </p>
      <p class="govuk-body">
        <strong>The User</strong> understands that use of the Service will be
        taken as their acceptance of these Terms &amp; Conditions and that they
        are fully aware of their responsibilities in relation to the use of the
        service as set out in the Terms &amp; Conditions on the page below.
      </p>

      <h2 class="govuk-heading-l">Terms and Conditions</h2>
      <ol class="govuk-list govuk-list--number govuk-list--spaced">
        <li>
          I have a legitimate need to use the PRE Service, and will only access
          recordings associated with media of cases where I have a business need
          to do so.
        </li>
        <li>
          I will comply with UK Data Protection Act 2018, relevant privacy
          regulations and all professional codes of conduct by which I am bound
          and will ensure all information accessed through the PRE Service is
          treated accordingly. I acknowledge that any breach of these provisions
          may result in my access to the PRE Service being suspended or
          terminated. Any breach may also result in disciplinary action.
        </li>
        <li>
          I will seek to prevent inadvertent disclosure of information by taking
          care when viewing the recording on the PRE Service. I will make every
          effort to ensure my screen is not visible to others who do not have a
          legitimate reason to see the recording.
        </li>
        <li>
          I agree to be accountable for any use of the PRE Service using my
          unique user credentials (user ID, password, log-in) and e-mail
          address. As such, I understand that:
          <ol type="a">
            <li>
              I must protect my PRE Service credentials for access to the
              service.
            </li>
            <li>I must not share my PRE Service credentials.</li>
            <li>
              I must report actual or suspected disclosure of this information
              to HMCTS through the local court.
            </li>
            <li>
              I will not use another person’s credentials to access the PRE
              Service.
            </li>
          </ol>
        </li>
        <li>
          I will ensure that computing devices connected to the PRE Service will
          not be left unattended unless they are physically secure and have a
          clear password locked screen.
        </li>
        <li>
          I will take precautions to protect all computer media and portable
          computers/devices that will be used to access the PRE Service at all
          times (e.g., by not leaving a device unattended or on display in a
          public space).
        </li>
        <li>
          I will not share any video recording or other content accessed via the
          PRE Service with any other party or persons, unless they have a legal
          right to view the recording.
        </li>
        <li>
          I will not access the PRE Service from public shared devices (e.g.
          those in internet cafes).
        </li>
        <li>
          I will only access the PRE Service from devices which have appropriate
          security controls installed and which are maintained to be up to date
          (including, as appropriate, firewalls, anti-virus &amp; spyware
          software and operating system security patches).
        </li>
        <li>
          I will not attempt to bypass or subvert system security controls.
        </li>
        <li>
          When using Wi-Fi, I will only access the PRE Service using secure
          internet connection or using secure internet service. I will not
          ‘trust’ or ‘accept’ invalid security for web site certificates.
        </li>
        <li>
          I confirm that I will only connect to the PRE Service from within the
          United Kingdom and will not attempt to access the PRE Service from a
          location that is outside the United Kingdom, without prior
          authorisation.
        </li>
        <li>
          I understand that HMCTS and the Ministry of Justice (MOJ) reserves the
          right to audit my usage and investigate security incidents and confirm
          that, should such an investigation be necessary, I will provide any
          necessary support to the best of my ability.
        </li>
        <li>
          I agree to report any data losses, breaches or security incidents by
          contacting the DTS Service Desk and Line Manager immediately.
        </li>
        <li>
          In the event of a suspected breach of these Terms &amp; Conditions
          HMCTS reserves the right to investigate and if a breach has occurred,
          to impose appropriate sanctions. This can range from a warning and
          instructions to improve practice, to temporary suspension or reduction
          in the service availability, to the potential complete withdrawal of
          service should the breach impact adversely users of the PRE Service,
          and other associated services.
        </li>
        <li>
          I will use the PRE Service in accordance with the appropriate user
          guides and agree to notify the helpdesk and line manager immediately
          if there is any change in my circumstances or role that affect my
          access to the Pre Service. This includes (but is not limited to)
          changes to my circumstances or role so that certain levels of access
          are no longer appropriate. I will inform the helpdesk and line manager
          prior to leaving my role in order that my account may be deleted.
        </li>
      </ol>
      <h3 class="govuk-heading-m">Declaration</h3>
      <p class="govuk-body">
        I declare that I am fully aware of my responsibilities in relation to
        the use of the Service as set out in the above Terms &amp; Conditions.
      </p>
      <app-terms-and-conditions-form
        *ngIf="isForm"
        (errorMessageEvent)="setSummaryErrorMessages($event)">
      </app-terms-and-conditions-form>
    </div>
  `,
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {
  isForm = false;
  errorMessages: ErrorMessage[] = [];
  private routeSubscription!: Subscription;

  constructor(public route: ActivatedRoute) {}
  ngOnInit() {
    this.routeSubscription = this.route.url.subscribe(value => {
      this.isForm =
        value[0].path === 'register' &&
        value[1].path === 'terms-and-conditions';
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }

  setSummaryErrorMessages(errorMessages: ErrorMessage[]) {
    this.errorMessages = errorMessages;
  }
}
