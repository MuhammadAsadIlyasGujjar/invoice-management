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
    const expenses: Expense[] = [
      {
        expense_id: "exp-tr0f8g639",
        date: new Date("2025-02-05T05:29:22.345Z"),
        amount: 1,
        category: "freight-shipping",
        payment_method: "Cash",
        description: "",
        vendor: "",
        user_id: "user-123",
        is_recurring: false,
        currency: "USD",
        status: "Pending",
        tags: [""],
        deleted: false
      },
      {
        expense_id: "exp-z7celtu2z",
        date: new Date("2025-02-05T05:29:39.419Z"),
        amount: 2,
        category: "employee-training",
        payment_method: "Cash",
        description: "",
        vendor: "",
        user_id: "user-123",
        is_recurring: false,
        currency: "USD",
        status: "Approved",
        tags: [""],
        deleted: false
      },
      {
        expense_id: "exp-hzv0v5cyi",
        date: new Date("2025-02-05T05:29:56.676Z"),
        amount: 3,
        category: "workers-compensation",
        payment_method: "Cash",
        description: "",
        vendor: "",
        user_id: "user-123",
        is_recurring: false,
        currency: "USD",
        status: "Reimbursed",
        tags: [""],
        deleted: false
      },
      {
        expense_id: "exp-cnozh4gk5",
        date: new Date("2025-01-31T19:00:00.000Z"),
        amount: 10,
        category: "vehicle-expenses",
        payment_method: "Cash",
        description: "",
        vendor: "",
        user_id: "user-123",
        is_recurring: false,
        currency: "GBP",
        status: "Pending",
        tags: [""],
        deleted: false
      },
      // Add more objects here...
    ];
  
    // Add more objects to reach 50
    for (let i = 11; i <= 50; i++) {
      expenses.push({
        expense_id: `exp-${Math.random().toString(36).substring(2, 10)}`,
        date: new Date(`2025-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}T${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}.000Z`),
        amount: Math.floor(Math.random() * 100) + 1,
        category: ["freight-shipping", "employee-training", "workers-compensation", "vehicle-expenses", "office-supplies", "travel", "entertainment", "utilities", "marketing", "software"][Math.floor(Math.random() * 10)],
        payment_method: ["Cash", "Credit Card", "Debit Card"][Math.floor(Math.random() * 3)],
        description: "",
        vendor: "",
        user_id: "user-123",
        is_recurring: false,
        currency: ["USD", "GBP", "EUR"][Math.floor(Math.random() * 3)],
        status: ["Pending", "Approved", "Reimbursed"][Math.floor(Math.random() * 3)],
        tags: [""],
        deleted: false
      });
    }
  
    // Validate dates before using them
    this.expenses = this.validateDates(expenses);
    return expenses;
  }
  
  validateDates(expenses: Expense[]): Expense[] {
    return expenses.map(expense => {
      // Check if the date is valid
      if (!expense.date || isNaN(new Date(expense.date).getTime())) {
        expense.date = null; // Set invalid dates to null
      }
      return expense;
    });
  }
}