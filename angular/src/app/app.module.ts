import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { NotificationBannerComponent } from './components/notification-banner/notification-banner.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ForgottenPasswordPageComponent } from './pages/forgotten-password-page/forgotten-password-page.component';
import { EnterInvitePageComponent } from './pages/enter-invite-page/enter-invite-page.component';
import { TwoFactorAuthPageComponent } from './pages/two-factor-auth-page/two-factor-auth-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DetailsComponent } from './components/details/details.component';
import { BrowsePageComponent } from './pages/browse-page/browse-page.component';
import { ErrorSummaryComponent } from './components/error-summary/error-summary.component';
import { WatchRecordingComponent } from './components/watch-recording/watch-recording.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { TermsAndConditionsFormComponent } from './pages/terms-and-conditions/terms-and-conditions-form/terms-and-conditions-form.component';
import { AccessibilityPageComponent } from './pages/accessibility-page/accessibility-page.component';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { WatchPageComponent } from './pages/watch-page/watch-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NotificationBannerComponent,
    LoginPageComponent,
    ForgottenPasswordPageComponent,
    EnterInvitePageComponent,
    TwoFactorAuthPageComponent,
    RegisterPageComponent,
    DetailsComponent,
    BrowsePageComponent,
    ErrorSummaryComponent,
    WatchRecordingComponent,
    TermsAndConditionsComponent,
    TermsAndConditionsFormComponent,
    AccessibilityPageComponent,
    BackLinkComponent,
    NotFoundPageComponent,
    WatchPageComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
