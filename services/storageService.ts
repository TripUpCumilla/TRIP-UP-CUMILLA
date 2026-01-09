
import { User, Tour, Guest, Expense } from '../types';

const STORAGE_KEY = 'TUC_DATA_STORE';

interface DataStore {
  users: User[];
  tours: Tour[];
  guests: Guest[];
  expenses: Expense[];
}

const getInitialData = (): DataStore => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return {
    users: [],
    tours: [],
    guests: [],
    expenses: []
  };
};

let dataStore: DataStore = getInitialData();

const persist = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataStore));
};

export const storageService = {
  // Auth simulation
  getUser: (email: string) => dataStore.users.find(u => u.email === email),
  createUser: (user: User) => {
    dataStore.users.push(user);
    persist();
  },

  // Tours
  getTours: (userId: string) => dataStore.tours.filter(t => t.userId === userId),
  addTour: (tour: Tour) => {
    dataStore.tours.push(tour);
    persist();
  },
  deleteTour: (id: string) => {
    dataStore.tours = dataStore.tours.filter(t => t.id !== id);
    dataStore.guests = dataStore.guests.filter(g => g.tourId !== id);
    dataStore.expenses = dataStore.expenses.filter(e => e.tourId !== id);
    persist();
  },

  // Guests
  getGuestsByTour: (tourId: string) => dataStore.guests.filter(g => g.tourId === tourId),
  addGuest: (guest: Guest) => {
    dataStore.guests.push(guest);
    persist();
  },
  deleteGuest: (id: string) => {
    dataStore.guests = dataStore.guests.filter(g => g.id !== id);
    persist();
  },

  // Expenses
  getExpensesByTour: (tourId: string) => dataStore.expenses.filter(e => e.tourId === tourId),
  addExpense: (expense: Expense) => {
    dataStore.expenses.push(expense);
    persist();
  },
  deleteExpense: (id: string) => {
    dataStore.expenses = dataStore.expenses.filter(e => e.id !== id);
    persist();
  },

  // Global report data for user
  getGlobalStats: (userId: string) => {
    const userTours = dataStore.tours.filter(t => t.userId === userId);
    const tourIds = userTours.map(t => t.id);
    const userGuests = dataStore.guests.filter(g => tourIds.includes(g.tourId));
    const userExpenses = dataStore.expenses.filter(e => tourIds.includes(e.tourId));

    const totalIncome = userGuests.reduce((sum, g) => sum + Number(g.paidAmount), 0);
    const totalExpenses = userExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      totalTours: userTours.length,
      totalGuests: userGuests.length,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses
    };
  }
};
