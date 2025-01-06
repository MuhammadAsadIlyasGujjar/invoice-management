import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-customer-order',
  standalone: true,
  imports: [PageHeaderComponent, ConfirmDialogComponent, ButtonModule, MenuModule],
  templateUrl: './customer-order.component.html',
  styleUrl: './customer-order.component.scss'
})
export class CustomerOrderComponent {

}
