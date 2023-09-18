import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBannerComponent } from './notification-banner.component';

@Component({
  template:
    '<app-notification-banner headerContent="Test Header">Test ng-content</app-notification-banner>',
})
class TestComponent {}

describe('NotificationBannerComponent', () => {
  let component: NotificationBannerComponent;
  let fixture: ComponentFixture<NotificationBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationBannerComponent, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header content', () => {
    fixture.detectChanges();

    const bannerTitleElement = fixture.nativeElement.querySelector(
      '.govuk-notification-banner__title'
    );

    expect(bannerTitleElement.textContent).toContain('Test Header');
  });

  it('should render the content provided via ng-content', () => {
    const notificationBody = fixture.nativeElement.querySelector(
      '[data-testid="notification-banner-body"]'
    );

    expect(notificationBody.textContent).toEqual('Test ng-content');
  });
});
