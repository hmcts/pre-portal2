import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RecordingData } from '../browse-page/recording-data.model';

@Component({
  selector: 'app-watch-page',
  template: `
    <div class="govuk-grid-column-full" *ngIf="recordingData">
      <h1 class="govuk-heading-l">Case Ref: {{ recordingData.caseRef }}</h1>

      <app-watch-recording
        [selectedRecordingSource]="recordingData.videoLink" />

      <div class="govuk-warning-text">
        <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong class="govuk-warning-text__text">
          <span class="govuk-warning-text__assistive">Please note</span>
          Playback is preferred on non-mobile devices. If possible, please use a
          preferred device.
        </strong>
      </div>

      <h2 class="govuk-heading-m">Recording details</h2>
      <dl class="govuk-summary-list govuk-!-margin-bottom-9">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key" data-testid="summary-title-date">
            Date
          </dt>
          <dd
            class="govuk-summary-list__value"
            data-testid="summary-value-date">
            {{ recordingData.formattedDateString() }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key" data-testid="summary-title-uid">
            Recording UID
          </dt>
          <dd class="govuk-summary-list__value" data-testid="summary-value-uid">
            {{ recordingData.recordingId }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt
            class="govuk-summary-list__key"
            data-testid="summary-title-version">
            Recording Version
          </dt>
          <dd
            class="govuk-summary-list__value"
            data-testid="summary-value-version">
            {{ recordingData.recordingVersion }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key" data-testid="summary-title-court">
            Court
          </dt>
          <dd
            class="govuk-summary-list__value"
            data-testid="summary-value-court">
            {{ recordingData.courtName }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt
            class="govuk-summary-list__key"
            data-testid="summary-title-witness">
            Witness
          </dt>
          <dd
            class="govuk-summary-list__value"
            data-testid="summary-value-witness">
            {{ recordingData.witness }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt
            class="govuk-summary-list__key"
            data-testid="summary-title-defendants">
            Defendants
          </dt>
          <dd
            class="govuk-summary-list__value"
            data-testid="summary-value-defendants">
            <ng-container
              *ngFor="let d of recordingData.defendants; let last = last">
              {{ d }}<br *ngIf="!last" />
            </ng-container>
          </dd>
        </div>
      </dl>
    </div>
  `,
})
export class WatchPageComponent implements OnInit {
  id!: string;
  // TODO Remove data here and get recording data from api
  recordingData?: RecordingData = new RecordingData(
    '123',
    1,
    'Example Ref',
    'Example Court',
    new Date(),
    'Example Link',
    'Person 1',
    ['Person 2', 'Person 3', 'Person 4']
  );

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];

      // TODO Call API to get recording data
    });
  }
}
