export type Tab = "personal" | "trip" | "bike" | "reports";

export type ExpenseType = "personal" | "trip" | "bike";

export interface Expense {
  id: string;
  type: ExpenseType;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  payment: string;
  tag?: string;
  notes?: string;
  split?: Record<string, number>;
  settled: boolean;
}

export interface Recurring {
  id: string;
  title: string;
  type: ExpenseType;
  category: string;
  cycle: "Monthly" | "Quarterly" | "Yearly" | string;
  next: string; // YYYY-MM-DD
  amount: number;
  payment: string;
}

export interface Budgets {
  personal: number;
  trip: number;
  bike: number;
}

export interface Filters {
  q: string;
  category: string;
  payment: string;
  from: string;
  to: string;
  unsettled: boolean;
}
