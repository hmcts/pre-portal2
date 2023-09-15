import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';

@Component({
  selector: 'app-test-component',
  template: `<app-details title="Details test">Details content</app-details>`,
})
class TestComponent {}

describe('DetailsComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title correctly', () => {
    const summaryTextElement = fixture.nativeElement.querySelector(
      '.govuk-details__summary-text'
    );
    expect(summaryTextElement.innerText).toContain('Details test');
  });

  it('should display the provided details content', () => {
    const compiledComponent = fixture.nativeElement;

    const summaryElement = fixture.nativeElement.querySelector(
      '.govuk-details__summary'
    );

    summaryElement.click();
    fixture.detectChanges();

    const detailsTextElement = compiledComponent.querySelector(
      '.govuk-details__text'
    );

    expect(detailsTextElement.innerText).toContain('Details content');
  });
});
