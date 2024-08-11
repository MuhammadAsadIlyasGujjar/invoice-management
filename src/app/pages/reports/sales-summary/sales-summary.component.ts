import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject, Input, OnInit } from '@angular/core';
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
  @Input() type: string | null = null;
  private invoicesService = inject(InvoicesService);
  private dataSharingService = inject(DataSharingService);
  views: MenuItem[] | undefined;
  activeView: MenuItem | undefined;
  salesSummary!: any[];

  cols: SortKey[] = [
    // { key: 'duration', label: 'Duration' },
    // { key: 'totalSales', label: 'Total Sales' },
    // { key: 'totalRevenue', label: 'Total Revenue' },
    // { key: 'averageInvoiceAmount', label: 'Average Invoice Amount' }
  ];
  chartOptions!: any;
  userSettings: any;
  momentDateFormat: any;
  filterParams: any;
  filterOptions!: any[];
  defaultOption!: string;
  filterType: string | null = null;

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

    if (this.type === 'sales-summary') {
      this.cols = [
        { key: 'duration', label: 'Duration', type:'string' },
        { key: 'totalSales', label: 'Total Sales', type: 'number' },
        { key: 'totalCost', label: 'Total Purchase Cost', type: 'number' },
        { key: 'totalRevenue', label: 'Total Revenue', type: 'number' },
        { key: 'totalProfit', label: 'Total Profit', type: 'number' },
        // { key: 'averageInvoiceAmount', label: 'Average Invoice Amount', type:'string' }
      ];

      this.filterOptions = [
        { name: 'Monthly', value: 'monthly' },
        { name: 'Weekly', value: 'weekly' },
        { name: 'Daily', value: 'daily' }
      ]

      this.defaultOption = 'monthly';
    } else if(this.type === 'by-product') {
      this.cols = [
        // { key: 'productId', label: 'Product ID', type:'string' },
        { key: 'productName', label: 'Product Name', type:'string' },
        { key: 'totalQuantitySold', label: 'Total Quantity Sold', type: 'number' },
        { key: 'totalCost', label: 'Total Purchase Cost', type: 'number' },
        { key: 'totalRevenue', label: 'Total Revenue', type: 'number' },
        { key: 'totalProfit', label: 'Total Profit', type: 'number' },
      ];

      this.filterOptions = [
        { name: 'Name', value: 'productName' },
        { name: 'Quantity Sold', value: 'totalQuantitySold' },
        { name: 'Profit', value: 'totalProfit' }
      ]

      this.defaultOption = 'productName';
      this.filterType = 'sort';
    } else if(this.type === 'by-customer') {
      this.cols = [
        // { key: 'customerId', label: 'Customer ID', type:'string' },
        { key: 'customerName', label: 'Customer Name', type:'string' },
        { key: 'totalSales', label: 'Total Sales', type: 'number' },
        { key: 'totalCost', label: 'Total Purchase Cost', type: 'number' },
        { key: 'totalRevenue', label: 'Total Revenue', type: 'number' },
        { key: 'totalProfit', label: 'Total Profit', type: 'number' },
      ];

      this.filterOptions = [
        { name: 'Name', value: 'customerName' },
        { name: 'Sales', value: 'totalSales' },
        { name: 'Profit', value: 'totalProfit' }
      ]

      this.defaultOption = 'customerName';
      this.filterType = 'sort';
    }
  }

  filterParamsChanged(formData: any) {
    if (this.type) {
      console.log(formData);
  
      this.filterParams = formData;

      
      const {startDate, endDate, option} = formData;
      this.defaultOption = option;
      let serviceObservable = null;
      if (this.type === 'sales-summary') {
        serviceObservable = this.invoicesService.getSalesSummary$(startDate, endDate, option)
      } else if(this.type === 'by-product') {
        serviceObservable = this.invoicesService.getSalesByProduct$(startDate, endDate)
      } else if(this.type === 'by-customer') {
        serviceObservable = this.invoicesService.getSalesByCustomer$(startDate, endDate)
      }
      if (serviceObservable) {
        serviceObservable.pipe(map((data: any[]) => {
          return this.transformData(data, option)
        }))
        .subscribe({
          next: (data: any) => {
            this.salesSummary = data;
            console.log(this.salesSummary);
            this.setChartOptions();
          },
          error: (error) => {
            console.error('Error fetching sales summary', error);
          }
        })
      }
    }
  }

  transformData(data: any[], option: string): any[] {
    if (this.type === 'sales-summary') {
      return data.map(record => {
        let duration: string = '';

        switch (option) {
          case 'monthly':
            duration = moment(record.fromDate).format('MMM YYYY');
            break;
          case 'weekly':
            const firstDayOfWeek = moment(record.toDate).subtract(1, "days").startOf('week').add(1, "days").format(`ddd ${this.momentDateFormat}`);
            const lastDayOfWeek = moment(record.toDate).subtract(1, "days").endOf('week').add(1, "days").format(`ddd ${this.momentDateFormat}`);
            duration = `${firstDayOfWeek} - ${lastDayOfWeek}`;
            break;
          case 'daily':
            duration = moment(record.fromDate).format(`ddd ${this.momentDateFormat}`);
            break;
          default:
            duration = ``;
        }

        return {
          duration,
          totalSales: record.totalSales,
          totalRevenue: Number(record.totalRevenue).toFixed(2),
          totalCost: Number(record.totalCost).toFixed(2),
          totalProfit: Number(record.totalRevenue - record.totalCost).toFixed(2),
          averageInvoiceAmount: Number(record.averageInvoiceAmount).toFixed(2)
        };
      });
    } else if(this.type === 'by-product') {
      data = data.map((item: any) => {
        return {
          ...item,
          totalProfit: item.totalRevenue - item.totalCost
        };
      });

      data = sortObjects(data, this.cols, this.defaultOption, this.filterParams?.sortOrder ?? 'desc');
      
      data = data.map((item: any) => {
        return {
          totalQuantitySold: item.totalQuantitySold,
          totalRevenue: Number(item.totalRevenue).toFixed(2),
          totalCost: Number(item.totalCost).toFixed(2),
          totalProfit: Number(item.totalRevenue - item.totalCost).toFixed(2),
          productId: item.productId,
          productName: `${item.productName} (${item.baseUnitOfMeasure})`
        };
      });

      return data;

    } else if(this.type === 'by-customer') {
      data = data.map((item: any) => {
        return {
          ...item,
          totalProfit: item.totalRevenue - item.totalCost
        };
      });

      data = sortObjects(data, this.cols, this.defaultOption, this.filterParams?.sortOrder ?? 'desc');
      
      data = data.map((item: any) => {
        return {
          totalSales: item.totalSales,
          totalRevenue: Number(item.totalRevenue).toFixed(2),
          totalCost: Number(item.totalCost).toFixed(2),
          totalProfit: Number(item.totalRevenue - item.totalCost).toFixed(2),
          customerId: item.customerId,
          customerName: item.customerName
        };
      });

      return data;

    }
    return data;
  }

  setChartOptions() {
    let option: any = null;
    if (this.type === 'sales-summary') {
      option = {
        title: {
          text: 'Sales Graph'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Total Sales', 'Total Revenue', 'Total Purchase Cost', 'Total Profit']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: this.salesSummary.map(item => item.duration),
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: [
          {
            type: 'value',
            name: 'Total Sales',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#5470C6'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: 'Total Revenue',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#91CC75'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          // {
          //   type: 'value',
          //   name: 'Average Invoice Amount',
          //   position: 'right',
          //   offset: 60,
          //   axisLine: {
          //     lineStyle: {
          //       color: '#EE6666'
          //     }
          //   },
          //   axisLabel: {
          //     formatter: '{value}'
          //   }
          // }
        ],
        series: [
          {
            name: 'Total Sales',
            type: 'line',
            data: this.salesSummary.map(item => item.totalSales),
          },
          {
            name: 'Total Purchase Cost',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalCost)),
            itemStyle: {
              color: '#FF6347'
            }
          },
          {
            name: 'Total Revenue',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalRevenue)),
            itemStyle: {
              color: '#FFD700'
            }
          },
          {
            name: 'Total Profit',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalProfit)),
            itemStyle: {
              color: '#90EE90'
            }
          }
          // {
          //   name: 'Average Invoice Amount',
          //   type: 'bar',
          //   data: this.salesSummary.map(item => parseFloat(item.averageInvoiceAmount)),
          //   yAxisIndex: 2
          // }
        ]
      };
  
    } else if(this.type === 'by-product') {
      option = {
        title: {
          text: 'Sales by Product Graph'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Quantity Sold', 'Total Purchase Cost', 'Total Revenue', 'Total Profit']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: this.salesSummary.map(item => item.productName)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Quantity Sold',
            type: 'line',
            data: this.salesSummary.map(item => item.totalQuantitySold)
          },
          {
            name: 'Total Purchase Cost',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalCost)),
            itemStyle: {
              color: '#FF6347'
            }
          },
          {
            name: 'Total Revenue',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalRevenue)),
            itemStyle: {
              color: '#FFD700'
            }
          },
          {
            name: 'Total Profit',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalProfit)),
            itemStyle: {
              color: '#90EE90'
            }
          }
        ]
      };
    } else if(this.type === 'by-customer') {
      option = {
        title: {
          text: 'Sales by Customer Graph'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Total Sales', 'Total Purchase Cost', 'Total Revenue', 'Total Profit']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: this.salesSummary.map(item => item.customerName)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Total Sales',
            type: 'line',
            data: this.salesSummary.map(item => item.totalSales)
          },
          {
            name: 'Total Purchase Cost',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalCost)),
            itemStyle: {
              color: '#FF6347'
            }
          },
          {
            name: 'Total Revenue',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalRevenue)),
            itemStyle: {
              color: '#FFD700'
            }
          },
          {
            name: 'Total Profit',
            type: 'bar',
            data: this.salesSummary.map(item => parseFloat(item.totalProfit)),
            itemStyle: {
              color: '#90EE90'
            }
          }
        ]
      };
    }

    
    this.chartOptions = option;
  }

  onActiveViewChange(view: any) {
    this.activeView = view;
  }

  print() {
    window.print();
  }
}


type SortKeyType = 'string' | 'number';

interface SortKey {
    key: string;
    label: string;
    type: SortKeyType;
}

function sortObjects(array: any[], sortKeys: SortKey[], sortKey: string, order: 'asc' | 'desc' = 'desc'): any[] {
    const keyObj = sortKeys.find(k => k.key === sortKey);

    if (!keyObj) {
        throw new Error(`Invalid sort key: ${sortKey}`);
    }

    return array.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (keyObj.type === 'number') {
            const comparison = aValue - bValue;
            return order === 'asc' ? comparison : -comparison;
        } else if (keyObj.type === 'string') {
            const comparison = aValue.localeCompare(bValue);
            return order === 'asc' ? comparison : -comparison;
        } else {
            return 0;
        }
    });
}


