import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { BackLinkComponent } from './back-link.component';

@Component({
  selector: 'app-test-comp',
  template: '<div></div>',
})
class TestComponent {}

describe('BackLinkComponent', () => {
  let component: BackLinkComponent;
  let fixture: ComponentFixture<BackLinkComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackLinkComponent, TestComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: TestComponent },
          { path: 'browse', component: TestComponent },
          { path: 'forgotten-password', component: TestComponent },
          { path: 'terms-and-conditions', component: TestComponent },
          { path: 'accessibility-statement', component: TestComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackLinkComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set visibility and content correctly for the login page at the "/" URL', () => {
    router.navigateByUrl('/');
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(linkElement).toBeFalsy();
  });

  it('should set visibility and content correctly for the terms and conditions page at the "/terms-and-conditions" URL', () => {
    router.navigateByUrl('/terms-and-conditions');
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(linkElement).toBeFalsy();
  });

  it('should set visibility and content correctly for the accessibility statement page at the "/accessibility-statement" URL', () => {
    router.navigateByUrl('/accessibility-statement');
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(linkElement).toBeFalsy();
  });

  it('should set visibility and content correctly for "/browse" URL', async () => {
    await router.navigate(['/browse']);
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(linkElement).toBeTruthy();
    expect(linkElement.nativeElement.textContent).toContain('Sign out');

    const navigateSpy = spyOn(router, 'navigate');
    linkElement.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to "/" when "Sign out" link is clicked', async () => {
    await router.navigate(['/browse']);
    fixture.detectChanges();

    const navigateSpy = spyOn(router, 'navigate');

    const linkElement = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(linkElement).toBeTruthy();

    linkElement.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should update link when navigation event occurs', async () => {
    await router.navigate(['/']);
    fixture.detectChanges();

    const linkElementAttempt1 = fixture.debugElement.query(
      By.css('.govuk-back-link')
    );
    expect(linkElementAttempt1).toBeFalsy();

    await router.navigate(['/forgotten-password']);
    fixture.detectChanges();

    const linkElementAttempt2 = fixture.debugElement.query(
      By.css('.govuk-back-link')
    );

    expect(linkElementAttempt2).toBeTruthy();
    expect(linkElementAttempt2.nativeElement.textContent).toContain('Back');
  });

  it('should navigate back when "Back" link is clicked', async () => {
    await router.navigate(['/']);
    fixture.detectChanges();

    await router.navigate(['/forgotten-password']);
    fixture.detectChanges();

    const historyBackSpy = spyOn(history, 'back');

    const linkElement = fixture.debugElement.query(By.css('.govuk-back-link'));
    expect(linkElement).toBeTruthy();

    linkElement.nativeElement.click();
    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from router events on component destroy', () => {
    const unsubscribeSpy = spyOn(
      component.navigationEventSubscription,
      'unsubscribe'
    );
    fixture.destroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
