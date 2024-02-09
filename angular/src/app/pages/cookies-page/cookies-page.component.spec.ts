import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiesPageComponent } from './cookies-page.component';
import { By } from '@angular/platform-browser';

describe('CookiesPageComponent', () => {
  let component: CookiesPageComponent;
  let fixture: ComponentFixture<CookiesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookiesPageComponent],
    });

    fixture = TestBed.createComponent(CookiesPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the heading "Cookies"', () => {
    const headingElement = fixture.debugElement.query(By.css('h1'));
    expect(headingElement.nativeElement.textContent).toContain('Cookies');
  });

  it('should contain a link to the Pre Recorded Evidence Service', () => {
    const govLinkElement = fixture.debugElement.query(By.css('.govuk-link'));
    expect(govLinkElement.nativeElement.href).toContain('/');
  });

  it('should display information about cookies', () => {
    const infoParagraphs = fixture.debugElement.queryAll(By.css('.govuk-body'));
    expect(infoParagraphs.length).toBeGreaterThan(0);
  });

  it('should have a form with the class "js-cookies-page-form"', () => {
    const formElement = fixture.debugElement.query(
      By.css('.js-cookies-page-form')
    );
    expect(formElement).toBeTruthy();
  });

  it('should display essential cookies information in a table', () => {
    const tableElement = fixture.debugElement.query(By.css('.govuk-table'));
    expect(tableElement).toBeTruthy();

    const tableCaptionElement = tableElement.query(
      By.css('.govuk-table__caption')
    );
    expect(tableCaptionElement.nativeElement.textContent).toContain(
      'Essential cookies we use'
    );

    const tableHeaders = tableElement.queryAll(By.css('.govuk-table__header'));
    expect(tableHeaders.length).toBe(4);
  });
});
