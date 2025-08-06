export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  description: string;
}

export enum InvoiceStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  OVERDUE = "OVERDUE",
}

export interface Invoice {
  id: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  feeStructure: FeeStructure;
}
