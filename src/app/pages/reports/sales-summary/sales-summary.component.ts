import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { RippleModule } from 'primeng/ripple';
import { ReportFiltersComponent } from '../report-filters/report-filters.component';
import { MenuItem } from 'primeng/api';
import { DynamicTableComponent } from '@common/components/dynamic-table/dynamic-table.component';
import { DynamicBarChartComponent } from '@common/components/dynamic-bar-chart/dynamic-bar-chart.component';

@Component({
  selector: 'app-sales-summary',
  standalone: true,
  imports: [CommonModule, TabMenuModule, RippleModule, ReportFiltersComponent, DynamicTableComponent, DynamicBarChartComponent],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss'
})
export class SalesSummaryComponent implements OnInit {
  views: MenuItem[] | undefined;
  activeView: MenuItem | undefined;

  ngOnInit() {
    this.views = [
      { label: 'Table', icon: 'pi pi-fw pi-table' },
      { label: 'Chart', icon: 'pi pi-fw pi-chart-line' }
    ];

    this.activeView = this.views[0];
  }

  filterParamsChanged(formData: any) {
    console.log(formData);
  }

  onActiveViewChange(view: any) {
    this.activeView = view;
  }
}
