export type PaymentStatus = 'draft' | 'sent' | 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'online' | 'cheque';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  _id?: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  paidAt: string;
  recordedBy?: any;
  notes?: string;
}

export interface Payment {
  _id: string;
  studentId: any;
  applicationId?: any;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: {
    type: 'percent' | 'fixed';
    value: number;
  };
  tax: number;
  totalAmount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  paidAmount: number;
  transactions: Transaction[];
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  overview: {
    totalRevenue: number;
    totalPending: number;
    totalOverdue: number;
    thisMonth: number;
  };
  monthlyRevenue: { _id: string; revenue: number }[];
  methodBreakdown: { _id: string; count: number; amount: number }[];
  topStudents: { _id: string; totalPaid: number; student: any }[];
}
