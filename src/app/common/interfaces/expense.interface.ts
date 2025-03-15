export interface Expense {
    expense_id: string;
    date: Date;
    amount: number;
    category: string;
    payment_method: string;
    description?: string;
    vendor?: string;
    user_id: string;
    is_recurring: boolean;
    currency: string;
    receipt?: string;
    project_id?: string;
    tax_amount?: number;
    status: string;
    tags: string[];
    deleted: boolean;
  }