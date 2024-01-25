import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowsePageComponent } from './browse-page.component';
import { WatchRecordingComponent } from '../../components/watch-recording/watch-recording.component';
import { RecordingData } from './recording-data.model';

describe('BrowsePageComponent', () => {
  let component: BrowsePageComponent;
  let fixture: ComponentFixture<BrowsePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrowsePageComponent, WatchRecordingComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should display welcome message with user's name", () => {
    const welcomeMessageElement =
      fixture.nativeElement.querySelector('.govuk-heading-l');

    expect(welcomeMessageElement).toBeTruthy();
    expect(welcomeMessageElement.textContent?.trim()).toBe(
      'Welcome back Test User'
    );
  });

  it('should display the warning text in the template', () => {
    const warningElement = fixture.nativeElement.querySelector(
      '.govuk-warning-text'
    );

    expect(warningElement).toBeTruthy();
  });

  // TODO Add this test back when remove dummy data
  // it('should display no data message when recordingData is empty', () => {
  //   const noDataMessageElement = fixture.nativeElement.querySelector(
  //     '[data-testid="no-data-message"]'
  //   );
  //
  //   expect(noDataMessageElement).toBeTruthy();
  //   expect(noDataMessageElement.textContent.trim()).toBe('No records found.');
  // });

  it('should display recordings when recordingData is not empty', () => {
    component.recordingData = [
      new RecordingData(
        'id1',
        4,
        'ABC123',
        'Example Court',
        new Date('2023-07-02'),
        'test link',
        'Person A',
        ['Person B']
      ),
      new RecordingData(
        'id2',
        1,
        'XYZ456',
        'Another Court',
        new Date('2023-07-25'),
        'test link',
        'Person C',
        ['Person D']
      ),
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll(
      '.govuk-table__body > .govuk-table__row'
    );

    expect(tableRows.length).toBe(2);

    const firstRow = tableRows[0];
    expect(firstRow.textContent).toContain('ABC123');
    expect(firstRow.textContent).toContain('Example Court');
    expect(firstRow.textContent).toContain('id1');
    expect(firstRow.textContent).toContain('4');
    expect(firstRow.textContent).toContain('02/07/2023');
    expect(firstRow.textContent).toContain('Person A');
    expect(firstRow.textContent).toContain('Person B');

    const secondRow = tableRows[1];
    expect(secondRow.textContent).toContain('XYZ456');
    expect(secondRow.textContent).toContain('Another Court');
    expect(secondRow.textContent).toContain('id2');
    expect(secondRow.textContent).toContain('4');
    expect(secondRow.textContent).toContain('25/07/2023');
    expect(secondRow.textContent).toContain('Person C');
    expect(secondRow.textContent).toContain('Person D');
  });

  it('should display the correct link when recordingData is not empty', () => {
    component.recordingData = [
      new RecordingData(
        '1',
        1,
        'ABC123',
        'Example Court',
        new Date('2023-07-01'),
        'test link',
        'Person 0',
        ['Person 1']
      ),
    ];
    fixture.detectChanges();

    const linkElement = fixture.nativeElement.querySelector('.govuk-link');

    expect(linkElement.getAttribute('href')).toBe('#/watch/1');
    expect(linkElement.textContent).toContain('Play');
  });
});
