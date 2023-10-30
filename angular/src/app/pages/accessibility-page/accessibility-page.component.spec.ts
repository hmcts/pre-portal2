import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityPageComponent } from './accessibility-page.component';

describe('AccessibilityPageComponent', () => {
  let component: AccessibilityPageComponent;
  let fixture: ComponentFixture<AccessibilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessibilityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector('h1');
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Accessibility statement');
  });

  it('should show a sub heading for compliance status section', () => {
    const header = fixture.nativeElement.querySelector(
      'h2[data-testid="heading-compliance"]'
    );
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Compliance status');
  });

  it('should show a sub heading for non-accessible-content section', () => {
    const header = fixture.nativeElement.querySelector(
      'h2[data-testid="heading-non-accessible-content"]'
    );
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Non-accessible content');
  });

  it('should show a sub heading for preparation of this accessibility statement section', () => {
    const header = fixture.nativeElement.querySelector(
      'h2[data-testid="heading-preparation"]'
    );
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe(
      'Preparation of this accessibility statement'
    );
  });

  it('should show a sub heading for enforcement procedure section', () => {
    const header = fixture.nativeElement.querySelector(
      'h2[data-testid="heading-enforcement"]'
    );
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Enforcement procedure');
  });
});
