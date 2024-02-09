import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieBannerComponent } from './cookie-banner.component';
import { By } from '@angular/platform-browser';

describe('CookieBannerComponent', () => {
  let component: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookieBannerComponent],
    });

    fixture = TestBed.createComponent(CookieBannerComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display the cookie banner', () => {
    const bannerElement = fixture.debugElement.query(
      By.css('.govuk-cookie-banner')
    );
    expect(bannerElement).toBeTruthy();
  });

  it('should display the accept message after accepting cookies', () => {
    component.acceptCookies();
    fixture.detectChanges();

    const bannerAcceptRejectButtons = fixture.nativeElement.querySelector(
      '[data-testid="cookie-banner-accept-reject"]'
    );
    expect(bannerAcceptRejectButtons).toBeFalsy();

    const bannerAcceptedMessage = fixture.nativeElement.querySelector(
      '[data-testid="cookie-banner-accepted"]'
    );

    expect(bannerAcceptedMessage).toBeTruthy();
    expect(bannerAcceptedMessage.hidden).toBeFalse();
  });

  it('should hide the accept/reject after rejecting cookies and show the rejected cookies message', () => {
    component.rejectCookies();
    fixture.detectChanges();

    const bannerAcceptRejectButtons = fixture.nativeElement.querySelector(
      '[data-testid="cookie-banner-accept-reject"]'
    );
    expect(bannerAcceptRejectButtons).toBeFalsy();

    const bannerRejectMessage = fixture.nativeElement.querySelector(
      '[data-testid="cookie-banner-rejected"]'
    );

    expect(bannerRejectMessage).toBeTruthy();
    expect(bannerRejectMessage.hidden).toBeFalse();
  });

  it('should display the reject message after rejecting cookies', () => {
    component.rejectCookies();
    fixture.detectChanges();

    const rejectMessageElement = fixture.debugElement
      .query(By.css('.govuk-cookie-banner__content'))
      .query(By.css('.govuk-body'));
    expect(rejectMessageElement).toBeTruthy();
    expect(rejectMessageElement.nativeElement.textContent.trim()).toContain(
      'You’ve accepted additional cookies. You can change your cookie settings at any time.'
    );
  });

  it('should hide the banner after clicking "Hide cookie message"', () => {
    component.clearBanner();
    fixture.detectChanges();

    const bannerElement = fixture.debugElement.query(
      By.css('.govuk-cookie-banner')
    );
    expect(bannerElement).toBeFalsy();
  });
});
