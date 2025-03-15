import { Injectable } from '@angular/core';
import { Expense } from '@common/interfaces/expense.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenses: Expense[] = []; // Replace with API calls

  getExpenses() {
    return this.expenses;
  }

  createExpense(expense: Expense) {
    this.expenses.push(expense);
  }

  updateExpense(updatedExpense: Expense) {
    const index = this.expenses.findIndex(e => e.expense_id === updatedExpense.expense_id);
    if (index !== -1) {
      this.expenses[index] = updatedExpense;
    }
  }

  deleteExpense(expenseId: string) {
    this.expenses = this.expenses.filter(e => e.expense_id !== expenseId);
  }

  getTempExpense(): Expense[] {
    const expenses = '[{"date":"2025-02-05T05:29:22.345Z","amount":"1","category":"freight-shipping","payment_method":"Cash","description":"","vendor":"","currency":"USD","status":"Pending","is_recurring":false,"tags":[""],"expense_id":"exp-tr0f8g639","user_id":"user-123","deleted":false},{"date":"2025-02-05T05:29:39.419Z","amount":"2","category":"employee-training","payment_method":"Cash","description":"","vendor":"","currency":"USD","status":"Approved","is_recurring":false,"tags":[""],"expense_id":"exp-z7celtu2z","user_id":"user-123","deleted":false},{"date":"2025-02-05T05:29:56.676Z","amount":"3","category":"workers-compensation","payment_method":"Cash","description":"","vendor":"","currency":"USD","status":"Reimbursed","is_recurring":false,"tags":[""],"expense_id":"exp-hzv0v5cyi","user_id":"user-123","deleted":false},{"date":"2025-01-31T19:00:00.000Z","amount":"10","category":"vehicle-expenses","payment_method":"Cash","description":"","vendor":"","currency":"GBP","status":"Pending","is_recurring":false,"tags":[""],"expense_id":"exp-cnozh4gk5","user_id":"user-123","deleted":false}]';
    return JSON.parse(expenses);
  }
}