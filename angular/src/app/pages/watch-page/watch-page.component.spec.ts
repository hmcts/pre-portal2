import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { WatchPageComponent } from './watch-page.component';
import { RecordingData } from '../browse-page/recording-data.model';
import { WatchRecordingComponent } from '../../components/watch-recording/watch-recording.component';

describe('WatchPageComponent', () => {
  let component: WatchPageComponent;
  let fixture: ComponentFixture<WatchPageComponent>;
  const recordingData = new RecordingData(
    'testId',
    1,
    'TEST123',
    'Test Court',
    new Date('01-01-2023'),
    'test link',
    'Person 0',
    ['Person 1', 'Person 2']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchPageComponent, WatchRecordingComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: any) => void) =>
                fn({ id: recordingData.recordingId }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchPageComponent);
    component = fixture.componentInstance;
    component.recordingData = recordingData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header containing the case ref', () => {
    const headerElement =
      fixture.nativeElement.querySelector('.govuk-heading-l');

    expect(headerElement).toBeTruthy();
    expect(headerElement.textContent?.trim()).toBe('Case Ref: TEST123');
  });

  it("should display the recording's data in a summary list", () => {
    const compiled = fixture.nativeElement;

    expect(
      compiled.querySelector(
        'dt.govuk-summary-list__key[data-testid="summary-title-date"]'
      ).textContent
    ).toContain('Date');
    expect(
      compiled.querySelector(
        'dd.govuk-summary-list__value[data-testid="summary-value-date"]'
      ).textContent
    ).toContain('01/01/2023');

    expect(
      compiled.querySelector(
        'dt.govuk-summary-list__key[data-testid="summary-title-uid"]'
      ).textContent
    ).toContain('Recording UID');
    expect(
      compiled.querySelector(
        'dd.govuk-summary-list__value[data-testid="summary-value-uid"]'
      ).textContent
    ).toContain('testId');

    expect(
      compiled.querySelector(
        'dt.govuk-summary-list__key[data-testid="summary-title-version"]'
      ).textContent
    ).toContain('Recording Version');
    expect(
      compiled.querySelector(
        'dd.govuk-summary-list__value[data-testid="summary-value-version"]'
      ).textContent
    ).toContain('1');

    expect(
      compiled.querySelector(
        'dt.govuk-summary-list__key[data-testid="summary-title-court"]'
      ).textContent
    ).toContain('Court');
    expect(
      compiled.querySelector(
        'dd.govuk-summary-list__value[data-testid="summary-value-court"]'
      ).textContent
    ).toContain('Test Court');

    expect(
      compiled.querySelector(
        'dt.govuk-summary-list__key[data-testid="summary-title-witness"]'
      ).textContent
    ).toContain('Witness');
    expect(
      compiled.querySelector(
        'dd.govuk-summary-list__value[data-testid="summary-value-witness"]'
      ).textContent
    ).toContain('Person 0');

    expect(
      compiled.querySelector(
        'dt.govuk-summary-list__key[data-testid="summary-title-defendants"]'
      ).textContent
    ).toContain('Defendants');
    expect(
      compiled.querySelector(
        'dd.govuk-summary-list__value[data-testid="summary-value-defendants"]'
      ).textContent
    ).toContain('Person 1 Person 2');
  });

  it('should display video player in the template', () => {
    const videoElement = fixture.nativeElement.querySelector(
      'video[data-testid="recording-video"]'
    );
    expect(videoElement).toBeTruthy();
    const sourceElement = fixture.nativeElement.querySelector(
      '[data-testid="recording-video"] > source'
    );

    expect(sourceElement.getAttribute('src')).toEqual('test link');
  });

  it('should display the warning text in the template', () => {
    const warningElement = fixture.nativeElement.querySelector(
      '.govuk-warning-text'
    );

    expect(warningElement).toBeTruthy();
  });

  it('should display the warning text in the template', () => {
    const warningElement = fixture.nativeElement.querySelector(
      '.govuk-warning-text'
    );

    expect(warningElement).toBeTruthy();
  });
});
