import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-back-link',
  template: `
    <ng-container *ngIf="isVisible">
      <a class="govuk-back-link" (click)="onClick()">{{ content }}</a>
    </ng-container>
  `,
  styles: [
    `
      a {
        cursor: pointer;
      }
    `,
  ],
})
export class BackLinkComponent implements OnInit, OnDestroy {
  isVisible = false;
  content = 'Back';
  navigationEventSubscription!: Subscription;
  onClick = () => {};

  constructor(private router: Router) {}

  private updateLink(url: string) {
    switch (url) {
      case '/':
        this.isVisible = false;
        break;
      case '/browse':
        this.isVisible = true;
        this.content = 'Sign out';
        this.onClick = () => {
          // TODO Sign out
          this.router.navigate(['/']);
        };
        break;
      default:
        this.isVisible = true;
        this.content = 'Back';
        this.onClick = () => {
          history.back();
        };
    }
  }

  ngOnInit() {
    this.navigationEventSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(value => {
        this.updateLink((value as NavigationEnd).url);
      });
  }

  ngOnDestroy() {
    this.navigationEventSubscription?.unsubscribe();
  }
}
