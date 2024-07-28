import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class DynamicBarChartComponent implements OnInit {
  chartOptions: any;

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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: [150, 230, 224, 218, 135, 147, 260]
        }
      ]
    };
  }
}
