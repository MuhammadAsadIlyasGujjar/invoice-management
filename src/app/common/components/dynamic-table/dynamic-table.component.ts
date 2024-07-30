import { Component, Input } from '@angular/core';
// import { Product } from '@domain/product';
// import { ProductService } from '@service/productservice';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dynamic-table',
    standalone: true,
    imports: [FormsModule, TableModule, CommonModule],
    // providers: [ProductService],
    templateUrl: './dynamic-table.component.html',
    styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent {
    products!: any[];

    @Input() cols: any[] = [
      { key: 'year', label: 'Year' },
      { key: 'month', label: 'Month' },
      { key: 'totalSales', label: 'Total Sales' },
      { key: 'totalRevenue', label: 'Total Revenue' },
      { key: 'averageInvoiceAmount', label: 'Average Invoice Amount' }
    ];
    @Input() dataList: any[] = [
      {
        "year": 2023,
        "month": 1,
        "totalSales": 50,
        "totalRevenue": 10000,
        "averageInvoiceAmount": 200
      },
      {
        "year": 2023,
        "month": 2,
        "totalSales": 45,
        "totalRevenue": 9000,
        "averageInvoiceAmount": 200
      },
    ];

    constructor() {}

    ngOnInit() {

    }

    splitDuration(value: string) {
      return value.split('-');
    }

    get calculatedWidth() {
      return `${100/this.cols.length}%`
    }
}
