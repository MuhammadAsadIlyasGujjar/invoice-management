import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from '@common/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { injectSpeedInsights } from '@vercel/speed-insights';import { FilterService } from '@common/services/filter/filter.service';
;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private router: Router = inject(Router);
  private filterService: FilterService = inject(FilterService);

  title = 'invoice-management';

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');

    // const browserLang = translate.getBrowserLang();
    // if (browserLang) {
    //   translate.use(browserLang.match(/en|es/) ? browserLang : 'es');
    // }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Get the current route URL
        const currentUrl = event.urlAfterRedirects;

        // Check if the user navigated away from /invoice and its child routes
        if (!currentUrl.startsWith('/invoice')) {
          // Clear the filter when navigating away from /invoice and related routes
          this.filterService.clearFilterState();
        }
      }
    });
  }

  ngOnInit(): void {
    injectSpeedInsights();
  }

}
