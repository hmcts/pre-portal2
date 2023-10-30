import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchRecordingComponent } from './watch-recording.component';

describe('WatchRecordingComponent', () => {
  let component: WatchRecordingComponent;
  let fixture: ComponentFixture<WatchRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchRecordingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render video element with selectedRecordingSource', () => {
    const selectedRecordingSource = 'http://example.com/sample-video.mp4';
    component.selectedRecordingSource = selectedRecordingSource;
    fixture.detectChanges();

    const videoElement = fixture.nativeElement.querySelector(
      'video[data-testid="recording-video"]'
    );

    expect(videoElement).toBeTruthy();

    const sourceElement = fixture.nativeElement.querySelector('source');

    expect(sourceElement).toBeTruthy();
    expect(sourceElement.getAttribute('src')).toBe(selectedRecordingSource);
  });

  it('should not render video element if selectedRecordingSource is not provided', () => {
    const videoElement = fixture.nativeElement.querySelector(
      'video[data-testid="recording-video"]'
    );

    expect(videoElement).toBeFalsy();
  });
});
