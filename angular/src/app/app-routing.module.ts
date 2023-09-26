import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ForgottenPasswordPageComponent } from './pages/forgotten-password-page/forgotten-password-page.component';
import { EnterInvitePageComponent } from './pages/enter-invite-page/enter-invite-page.component';
import { TwoFactorAuthPageComponent } from './pages/two-factor-auth-page/two-factor-auth-page.component';
import { BrowsePageComponent } from './pages/browse-page/browse-page.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AccessibilityPageComponent } from './pages/accessibility-page/accessibility-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { WatchPageComponent } from './pages/watch-page/watch-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgottenPasswordPageComponent },
  { path: 'enter-invitation', component: EnterInvitePageComponent },
  { path: 'two-factor-auth', component: TwoFactorAuthPageComponent },
  // { path: 'browse/:id', component: BrowsePageComponent },
  { path: 'browse', component: BrowsePageComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  {
    path: 'register/terms-and-conditions',
    component: TermsAndConditionsComponent,
  },
  { path: 'register', component: RegisterPageComponent },
  { path: 'accessibility-statement', component: AccessibilityPageComponent },
  { path: 'watch/:id', component: WatchPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
