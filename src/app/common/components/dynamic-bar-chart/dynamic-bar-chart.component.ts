import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-dynamic-bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  templateUrl: './dynamic-bar-chart.component.html',
  styleUrl: './dynamic-bar-chart.component.scss'
})
export class DynamicBarChartComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.['data'] && !changes?.['data'].firstChange) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.chartOptions = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Sales']
      },
      xAxis: {
        type: 'category',
        data: this.data.map((record: { label: string; value: string; }) => record.label)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: this.data.map((record: { label: string; value: string; }) => record.value)
        }
      ]
    };
  }
}
