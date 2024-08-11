import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  @Input() chartOptions: any = null;

  ngOnInit(): void {
    
  }

  
}
