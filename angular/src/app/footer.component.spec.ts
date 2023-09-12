import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
    }).compileComponents();
  });

  it('should create the footer', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const footer = fixture.componentInstance;
    expect(footer).toBeTruthy();
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('should render terms and conditions link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelectorAll('.govuk-footer__link')[0]?.textContent
    ).toEqual('Terms and conditions');
  });

  it('should render accessibility statement link"]', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelectorAll('.govuk-footer__link')[1]?.textContent
    ).toEqual('Accessibility statement');
  });

  it('should render open government licence link"]', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelectorAll('.govuk-footer__link')[2]?.textContent
    ).toEqual('Open Government Licence v3.0');
  });

  it('should render crown copyright link"]', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelectorAll('.govuk-footer__link')[3]?.textContent
    ).toEqual('© Crown copyright');
  });
});
