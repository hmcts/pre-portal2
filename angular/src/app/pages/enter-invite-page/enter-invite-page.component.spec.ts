import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { AppModule } from '../../app.module';
import { EnterInvitePageComponent } from './enter-invite-page.component';
import { ErrorSummaryComponent } from '../../components/error-summary/error-summary.component';

describe('EnterInvitePageComponent', () => {
  let component: EnterInvitePageComponent;
  let fixture: ComponentFixture<EnterInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterInvitePageComponent, ErrorSummaryComponent],
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EnterInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector(
      'h1[data-testid="invite-code-title"]'
    );

    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Sign up with an invitation code');
  });

  it('should show an invite code input field', () => {
    const codeInputField = fixture.nativeElement.querySelector('input#code');

    expect(codeInputField).toBeTruthy();
  });

  it('should display error message when invite code is empty', () => {
    const form = {
      controls: { code: { errors: { required: true } } },
    } as unknown as NgForm;

    component.onSubmit(form);
    fixture.detectChanges();

    const codeErrorElement = fixture.nativeElement.querySelector(
      'p[data-testid="invite-code-error"]'
    );

    expect(codeErrorElement).toBeTruthy();
    expect(codeErrorElement.textContent.trim()).toBe(
      'Error: Enter your invitation code'
    );
  });

  it('should display the error summary with a link to the code input when the code is empty', () => {
    component.onSubmit({
      controls: {
        code: { errors: { required: true } },
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeTruthy();

    const errorSummaryLink = fixture.nativeElement.querySelector(
      'a[data-testid="error-summary-link"]'
    );
    expect(errorSummaryLink).toBeTruthy();
    expect(errorSummaryLink.getAttribute('href')).toBe('#code');
    expect(errorSummaryLink.textContent.trim()).toBe(
      'Enter your invitation code'
    );
  });

  it('should not display error message when the invite code is valid', () => {
    const form = {
      controls: { code: { errors: null } },
      value: { code: '12345' },
    } as unknown as NgForm;

    component.onSubmit(form);
    fixture.detectChanges();

    const codeErrorElement = fixture.nativeElement.querySelector(
      'p[data-testid="invite-code-error"]'
    );

    expect(codeErrorElement).toBeFalsy();
  });

  it('should not display an error summary when the code is valid', () => {
    component.onSubmit({
      controls: {
        code: { errors: null },
      },
      value: {
        code: 'TEST123',
      },
    } as unknown as NgForm);

    fixture.detectChanges();

    const errorSummaryElement = fixture.nativeElement.querySelector(
      '.govuk-error-summary'
    );
    expect(errorSummaryElement).toBeFalsy();
  });
});
