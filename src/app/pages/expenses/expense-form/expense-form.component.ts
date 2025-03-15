import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense } from '@common/interfaces/expense.interface';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { expenseCategories, ExpenseCategory } from '@common/models/expense-category.model';

@Component({
  selector: 'app-expense-form',
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
    ReactiveFormsModule
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent {
  @Input() expense?: Expense;
  @Output() save = new EventEmitter<Expense>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  categories = ['Food', 'Transport', 'Utilities', 'Entertainment'];
  expenseCategories: ExpenseCategory[] = expenseCategories;
  paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'];
  statuses = ['Pending', 'Approved', 'Reimbursed'];
  currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: [new Date(), Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      payment_method: ['Cash', Validators.required],
      description: [''],
      vendor: [''],
      currency: ['USD', Validators.required],
      status: ['Pending', Validators.required],
      is_recurring: [false],
      tags: ['']
    });
  }

  ngOnChanges() {
    if (this.expense) {
      this.form.patchValue({
        ...this.expense,
        tags: this.expense.tags?.join(', ')
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const expense: Expense = {
        ...this.form.value,
        tags: this.form.value.tags.split(',').map((t: string) => t.trim()),
        expense_id: this.expense?.expense_id || this.generateId(),
        user_id: 'user-123',
        deleted: false
      };
      this.save.emit(expense);
    }
  }

  private generateId() {
    return 'exp-' + Math.random().toString(36).substr(2, 9);
  }
}
