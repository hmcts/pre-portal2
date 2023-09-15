import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RecordingData } from './recording-data.model';

@Component({
  selector: 'app-browse-page',
  template: `
    <div class="govuk-grid-column-full">
      <h1 class="govuk-heading-l">Welcome back {{ user.name }}</h1>

      <div class="govuk-warning-text">
        <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong class="govuk-warning-text__text">
          <span class="govuk-warning-text__assistive">Please note</span>
          Playback is preferred on non-mobile devices. If possible, please use a
          preferred device.
        </strong>
      </div>

      <app-watch-recording [selectedRecordingSource]="selectedRecordingLink">
      </app-watch-recording>

      <table class="govuk-table">
        <caption class="govuk-table__caption govuk-table__caption--m">
          Recordings shared with you
        </caption>
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">Case Ref</th>
            <th scope="col" class="govuk-table__header">Court</th>
            <th scope="col" class="govuk-table__header">Date</th>
            <th scope="col" class="govuk-table__header">Witness</th>
            <th scope="col" class="govuk-table__header">Defendants</th>
            <th scope="col" class="govuk-table__header">Recording UID</th>
            <th scope="col" class="govuk-table__header">Version</th>
            <th scope="col" class="govuk-table__header"></th>
          </tr>
        </thead>
        <tbody
          class="govuk-table__body"
          *ngIf="recordingData.length === 0"
          data-testid="no-data-message">
          <td>No records found.</td>
        </tbody>
        <tbody class="govuk-table__body" *ngIf="recordingData.length > 0">
          <tr
            class="govuk-table__row"
            *ngFor="let rowData of recordingData"
            [id]="rowData.recordingId">
            <td class="govuk-table__cell">
              {{ rowData.caseRef }}
            </td>
            <td class="govuk-table__cell">
              {{ rowData.courtName }}
            </td>
            <td class="govuk-table__cell">
              {{ rowData.formattedDateString() }}
            </td>
            <td class="govuk-table__cell">
              {{ rowData.witness }}
            </td>
            <td class="govuk-table__cell">
              <ng-container
                *ngFor="let d of rowData.defendants; let last = last">
                {{ d }}<br *ngIf="!last" />
              </ng-container>
            </td>
            <td class="govuk-table__cell">{{ rowData.recordingId }}</td>
            <td class="govuk-table__cell">
              {{ rowData.recordingVersion }}
            </td>
            <td class="govuk-table__cell">
              <a
                class="govuk-link"
                href="/browse/{{ rowData.recordingId }}"
                (click)="selectRecording(rowData)"
                >Play<span class="govuk-visually-hidden">{{
                  rowData.recordingId
                }}</span></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class BrowsePageComponent implements OnInit {
  // TODO Get user data from logged in user
  user: { name: string } = { name: 'Test User' };
  // TODO Call api query recordings shared with user ngOnInit
  recordingData: RecordingData[] = [];
  selectedRecordingLink?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const recordingId = params['id'];
      // TODO Call API to get recording data

      this.selectedRecordingLink = this.recordingData
        .filter(data => data.recordingId === recordingId)
        .pop()?.videoLink;
    });
  }

  selectRecording(recording: RecordingData) {
    this.selectedRecordingLink = recording.videoLink;
  }
}
