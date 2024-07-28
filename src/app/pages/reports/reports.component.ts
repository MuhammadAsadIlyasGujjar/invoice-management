import { Component } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { AccordionModule } from 'primeng/accordion';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [PageHeaderComponent, SalesSummaryComponent, AccordionModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  filterParamsChanged(formData: any) {
    console.log(formData);
  }
}
