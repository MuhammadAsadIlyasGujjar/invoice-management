import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '@common/components/base/base.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { expenseCategories, ExpenseCategory } from '@common/models/expense-category.model';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';

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
    ConfirmDialogComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent extends BaseComponent {
  selectedCategory!: ExpenseCategory;
  expenseCategories: ExpenseCategory[] = expenseCategories;

  showExpenseUpdateDialog: boolean = false;
  selectedExpense: any;

  onAddExpense(event: any) {
    this.showExpenseUpdateDialog = true;
    this.selectedExpense = null;
  }

  onHideUpdateDialog(event: any) {
    this.selectedExpense = null;
    this.showExpenseUpdateDialog = false;
  }
}
