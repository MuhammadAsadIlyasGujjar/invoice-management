import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '@common/components/base/base.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ExpenseListComponent } from './expense-list/expense-list.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule, DropdownModule, FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    ConfirmDialogWrapperModule,
    ToastWrapperModule,
    PageHeaderComponent,
    ExpenseListComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent extends BaseComponent {

  showExpenseUpdateDialog: boolean = false;

  onAddExpense(event: any) {
    this.showExpenseUpdateDialog = true;
  }

  onDisplayDialogChange(event: boolean) {
    this.showExpenseUpdateDialog = event;
  }
}
