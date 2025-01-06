import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { Item } from '@common/interfaces/items.interface';
import { ItemsService } from '@common/services/items/items.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-request',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ConfirmDialogComponent, ButtonModule, MenuModule],
  templateUrl: './order-request.component.html',
  styleUrl: './order-request.component.scss'
})
export class OrderRequestComponent implements OnInit {
  private itemsService = inject(ItemsService);
  items!: Item[];

  constructor() { 
    this.items = [];
    effect(() => {
  
      const itemsListSignal = this.itemsService.getItemsSignal();
      this.items = itemsListSignal().map((item: any) => item);
    });
  }

  ngOnInit(): void {
  }
}
