
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface Tour {
  id: string;
  userId: string;
  tourName: string;
  tourDate: string;
  hostName: string;
  totalSeats: number;
  pricePerSeat: number; // Added field
  description: string;
  createdAt: string;
}

export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';

export interface Guest {
  id: string;
  tourId: string;
  userId: string;
  guestName: string;
  mobileNumber: string;
  seatNumber: string;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type ExpenseCategory = 'Transport' | 'Hotel' | 'Food' | 'Guide' | 'Other';

export interface Expense {
  id: string;
  tourId: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  note: string;
  createdAt: string;
}

export interface TourStats {
  totalTours: number;
  totalGuests: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}
