import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '@common/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { injectSpeedInsights } from '@vercel/speed-insights';;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'invoice-management';

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');

    // const browserLang = translate.getBrowserLang();
    // if (browserLang) {
    //   translate.use(browserLang.match(/en|es/) ? browserLang : 'es');
    // }
  }

  ngOnInit(): void {
    injectSpeedInsights();
  }

}
