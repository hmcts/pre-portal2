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

  it('should hide the banner after accepting cookies', () => {
    component.acceptCookies();
    fixture.detectChanges();

    const bannerElement = fixture.debugElement.query(
      By.css('.govuk-cookie-banner')
    );
    expect(bannerElement).toBeFalsy();
  });

  it('should display the accept message after accepting cookies', () => {
    component.acceptCookies();
    fixture.detectChanges();

    const acceptMessageElement = fixture.debugElement.query(By.css('[hidden]'));
    expect(acceptMessageElement).toBeFalsy();
  });

  it('should hide the banner after rejecting cookies', () => {
    component.rejectCookies();
    fixture.detectChanges();

    const bannerElement = fixture.debugElement.query(
      By.css('.govuk-cookie-banner')
    );
    expect(bannerElement).toBeFalsy();
  });

  it('should display the reject message after rejecting cookies', () => {
    component.rejectCookies();
    fixture.detectChanges();

    const rejectMessageElement = fixture.debugElement.query(By.css('[hidden]'));
    expect(rejectMessageElement).toBeFalsy();
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
