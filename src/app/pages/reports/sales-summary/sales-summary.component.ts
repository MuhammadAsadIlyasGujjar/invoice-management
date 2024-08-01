import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { RippleModule } from 'primeng/ripple';
import { ReportFiltersComponent } from '../report-filters/report-filters.component';
import { MenuItem } from 'primeng/api';
import { DynamicTableComponent } from '@common/components/dynamic-table/dynamic-table.component';
import { DynamicBarChartComponent } from '@common/components/dynamic-bar-chart/dynamic-bar-chart.component';
import { InvoicesService } from '@common/services/invoices/invoices.service';
import moment from 'moment';
import { map } from 'rxjs';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-summary',
  standalone: true,
  imports: [CommonModule, TabMenuModule, RippleModule, ReportFiltersComponent, DynamicTableComponent, DynamicBarChartComponent,
    TranslateModule],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss'
})
export class SalesSummaryComponent implements OnInit {
  private invoicesService = inject(InvoicesService);
  private dataSharingService = inject(DataSharingService);
  views: MenuItem[] | undefined;
  activeView: MenuItem | undefined;
  salesSummary!: any[];

  cols: any[] = [
    { key: 'duration', label: 'Duration' },
    { key: 'totalSales', label: 'Total Sales' },
    { key: 'totalRevenue', label: 'Total Revenue' },
    // { key: 'averageInvoiceAmount', label: 'Average Invoice Amount' }
  ];
  graphData!: { label: any; value: any; }[];
  userSettings: any;
  momentDateFormat: any;
  filterParams: any;

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
      if (this.userSettings?.dateFormat) {
        this.momentDateFormat = this.dataSharingService.angularToMomentFormat(this.userSettings.dateFormat);
      }
    }, options);
  }

  ngOnInit() {
    this.views = [
      { label: 'Table', icon: 'pi pi-fw pi-table' },
      { label: 'Chart', icon: 'pi pi-fw pi-chart-line' }
    ];

    this.activeView = this.views[0];
  }

  filterParamsChanged(formData: any) {
    console.log(formData);

    this.filterParams = formData;

    const {startDate, endDate, granularity} = formData;
    this.invoicesService.getSalesSummary$(startDate, endDate, granularity)
    .pipe(map((data: any[]) => {
      return this.transformData(data, granularity)
    }))
    .subscribe({
      next: (data: any) => {
        this.salesSummary = data.reverse();
        console.log(this.salesSummary);
        this.graphData = this.salesSummary.map((data: any) => {
          return {label: data.duration, value: data.totalRevenue};
        });
      },
      error: (error) => {
        console.error('Error fetching sales summary', error);
      }
    })
  }

  transformData(data: any[], granularity: string): any[] {
    return data.map(item => {
      let duration: string = '';

      switch (granularity) {
        case 'monthly':
          duration = moment(item.fromDate).format('MMM YYYY');
          break;
        case 'weekly':
          const firstDayOfWeek = moment(item.toDate).subtract(1, "days").startOf('week').add(1, "days").format(`ddd ${this.momentDateFormat}`);
          const lastDayOfWeek = moment(item.toDate).subtract(1, "days").endOf('week').add(1, "days").format(`ddd ${this.momentDateFormat}`);
          duration = `${firstDayOfWeek} - ${lastDayOfWeek}`;
          break;
        case 'daily':
          duration = moment(item.fromDate).format(`ddd ${this.momentDateFormat}`);
          break;
        default:
          duration = ``;
      }

      return {
        duration,
        totalSales: item.totalSales,
        totalRevenue: Number(item.totalRevenue).toFixed(2),
        averageInvoiceAmount: Number(item.averageInvoiceAmount).toFixed(2)
      };
    });
  }

  onActiveViewChange(view: any) {
    this.activeView = view;
  }

  print() {
    window.print();
  }
}
