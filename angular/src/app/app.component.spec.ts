import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { routes } from './app-routing.module';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ForgottenPasswordPageComponent } from './pages/forgotten-password-page/forgotten-password-page.component';
import { EnterInvitePageComponent } from './pages/enter-invite-page/enter-invite-page.component';
import { TwoFactorAuthPageComponent } from './pages/two-factor-auth-page/two-factor-auth-page.component';
import { BrowsePageComponent } from './pages/browse-page/browse-page.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { TermsAndConditionsFormComponent } from './pages/terms-and-conditions/terms-and-conditions-form/terms-and-conditions-form.component';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { RecordingData } from './pages/browse-page/recording-data.model';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AccessibilityPageComponent } from './pages/accessibility-page/accessibility-page.component';

describe('AppComponent', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        BackLinkComponent,
      ],
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render footer', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should render skip link', () => {
    const compiled = fixture.nativeElement;
    const skipLink = compiled.querySelector('.govuk-skip-link');
    expect(skipLink).toBeTruthy();

    if (!skipLink) {
      return;
    }

    expect(skipLink.textContent).toContain('Skip to main content');
    expect(skipLink.getAttribute('href')).toContain('#main-content');
  });

  it('should render app back link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-back-link')).toBeTruthy();
  });

  it('should render main', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#main-content')).toBeTruthy();
  });

  it('should show the login page by default', async () => {
    await router.navigate(['']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(LoginPageComponent)
    );
    expect(pageComponent).toBeTruthy();
  });

  it('should show the forgotten password page', async () => {
    await router.navigate(['forgot-password']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(ForgottenPasswordPageComponent)
    );
    expect(pageComponent).toBeTruthy();
  });

  it('should show the enter invitation page', async () => {
    await router.navigate(['enter-invitation']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(EnterInvitePageComponent)
    );
    expect(pageComponent).toBeTruthy();
  });

  it('should show the two factor authentication page', async () => {
    await router.navigate(['two-factor-auth']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(TwoFactorAuthPageComponent)
    );
    expect(pageComponent).toBeTruthy();
  });

  it('should show the browse page', async () => {
    await router.navigate(['browse']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(BrowsePageComponent)
    );
    expect(pageComponent).toBeTruthy();
  });

  it('should show the video player variant of the browse page', async () => {
    await router.navigate(['browse/1']);

    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(BrowsePageComponent)
    );

    pageComponent.componentInstance.recordingData = [
      new RecordingData(
        '1',
        2,
        'CASEABC',
        'Example Court',
        new Date(),
        'link',
        'Person 1',
        ['Person 2', 'Person 3']
      ),
    ];
    pageComponent.componentInstance.selectedRecordingLink = '1';
    fixture.detectChanges();

    const videoElement = fixture.nativeElement.querySelector(
      'video[data-testid="recording-video"]'
    );

    expect(videoElement).toBeTruthy();
  });

  it('should show the terms and conditions page', async () => {
    await router.navigate(['terms-and-conditions']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(TermsAndConditionsComponent)
    );
    const termsAndConditionsForm = fixture.debugElement.query(
      By.directive(TermsAndConditionsFormComponent)
    );

    expect(pageComponent).toBeTruthy();
    expect(termsAndConditionsForm).toBeFalsy();
  });

  it('should show the registration variant of the terms and conditions page', async () => {
    await router.navigate(['register/terms-and-conditions']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(TermsAndConditionsFormComponent)
    );

    const termsAndConditionsForm = fixture.debugElement.query(
      By.directive(TermsAndConditionsFormComponent)
    );

    expect(pageComponent).toBeTruthy();
    expect(termsAndConditionsForm).toBeTruthy();
  });

  it('should show the register page', async () => {
    await router.navigate(['register']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(RegisterPageComponent)
    );

    expect(pageComponent).toBeTruthy();
  });

  it('should show the accessibility statement page', async () => {
    await router.navigate(['accessibility-statement']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(AccessibilityPageComponent)
    );

    expect(pageComponent).toBeTruthy();
  });

  it('should show the 404 page when the route is not defined', async () => {
    await router.navigate(['test']);
    fixture.detectChanges();

    const pageComponent = fixture.debugElement.query(
      By.directive(NotFoundPageComponent)
    );

    expect(pageComponent).toBeTruthy();
  });
});
