import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a header', () => {
    const header = fixture.nativeElement.querySelector('h1');

    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Page not found');
  });

  it('should show a link to the login screen', () => {
    const link = fixture.nativeElement.querySelector('a.govuk-link');

    expect(link).toBeTruthy();
    expect(link.textContent.trim()).toBe('browse from the homepage');
    expect(link.getAttribute('href')).toBe('/');
  });
});
