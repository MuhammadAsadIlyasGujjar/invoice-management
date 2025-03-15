import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Expense } from '@common/interfaces/expense.interface';
import { ExpenseService } from '@common/services/expense/expense.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { expenseCategories, ExpenseCategory } from '@common/models/expense-category.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    CheckboxModule,
    TagModule,
    ReactiveFormsModule,
    ExpenseFormComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  private _displayDialog: boolean = false;

  @Input()
  set displayDialog(value: boolean) {
    this._displayDialog = value;
  }

  get displayDialog(): boolean {
    return this._displayDialog;
  }

  @Output() displayDialogChange = new EventEmitter<boolean>();

  expenses: Expense[] = [];
  selectedExpense?: Expense;
  expenseCategories: ExpenseCategory[] = expenseCategories;
  
  cols = [
    { field: 'date', header: 'Date' },
    { field: 'category', header: 'Category' },
    { field: 'amount', header: 'Amount' },
    { field: 'payment_method', header: 'Payment Method' },
    { field: 'vendor', header: 'Vendor' },
    { field: 'status', header: 'Status' }
  ];

  constructor(
    private expenseService: ExpenseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.expenses = this.expenseService.getTempExpense();
  }

  ngOnInit() {
    // this.loadExpenses();
  }

  loadExpenses() {
    this.expenses = this.expenseService.getExpenses();
  }

  showDialog(expense?: Expense) {
    this.selectedExpense = expense ? { ...expense } : undefined;
    this.displayDialog = true;
    this.displayDialogChange.emit(this.displayDialog);
  }

  deleteExpense(expenseId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this expense?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.expenseService.deleteExpense(expenseId);
        this.loadExpenses();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Expense deleted'
        });
      }
    });
  }

  onSaveExpense(expense: Expense) {
    if (expense) {
      if (this.selectedExpense) {
        this.expenseService.updateExpense(expense);
      } else {
        this.expenseService.createExpense(expense);
      }
      this.loadExpenses();
      this.displayDialog = false
      this.displayDialogChange.emit(this.displayDialog);
    }
  }

  onDialogClose(refresh: boolean) {
    this.displayDialog = false;
    this.displayDialogChange.emit(this.displayDialog);
    this.selectedExpense = undefined;
    if (refresh) this.loadExpenses();
  }

  getStatusSeverity(status: string): string {

    switch (status) {

      case 'Pending':

        return 'warning';

      case 'Approved':

        return 'success';

      case 'Rejected':

        return 'danger';

      default:

        return 'info';

    }

  }

  getExpenseCategoryLabel(category: string): string | null {
    
    return this.getLabelByValue(category, this.expenseCategories);
  }

  /**
 * Recursively searches for an item by its value and returns its label.
 *
 * @param value - The value to search for.
 * @param items - The array of items to search through.
 * @returns The label of the item if found, or null if not found.
 */
  getLabelByValue(value: string, items: any[]): string | null {
    for (const item of items) {
      // Check if the current item's value matches.
      if (item.value === value) {
        return item.label;
      }
      // If the item has children, search recursively.
      if (item.items && Array.isArray(item.items)) {
        const result = this.getLabelByValue(value, item.items);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
}