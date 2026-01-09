
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import { Card, Button, Input, Label } from './components/SharedUI';
import Dashboard from './views/Dashboard';
import TourList from './views/TourList';
import TourDetail from './views/TourDetail';
import Reports from './views/Reports';
import { storageService } from './services/storageService';
import { User, Tour, Guest, Expense } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // App Data State (Synced with storageService)
  const [tours, setTours] = useState<Tour[]>([]);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);

  // Load user from persistent storage (simulated session)
  useEffect(() => {
    const savedEmail = localStorage.getItem('TUC_SESSION_EMAIL');
    if (savedEmail) {
      const user = storageService.getUser(savedEmail);
      if (user) {
        setCurrentUser(user);
        loadUserData(user.id);
      }
    }
  }, []);

  const loadUserData = (userId: string) => {
    const userTours = storageService.getTours(userId);
    setTours(userTours);
    
    let guests: Guest[] = [];
    let expenses: Expense[] = [];
    userTours.forEach(t => {
      guests = [...guests, ...storageService.getGuestsByTour(t.id)];
      expenses = [...expenses, ...storageService.getExpensesByTour(t.id)];
    });
    setAllGuests(guests);
    setAllExpenses(expenses);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    setTimeout(() => {
      if (isRegistering) {
        const newUser: User = {
          id: Date.now().toString(),
          name: authForm.name,
          email: authForm.email,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        storageService.createUser(newUser);
        setCurrentUser(newUser);
        localStorage.setItem('TUC_SESSION_EMAIL', newUser.email);
        loadUserData(newUser.id);
      } else {
        const user = storageService.getUser(authForm.email);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('TUC_SESSION_EMAIL', user.email);
          loadUserData(user.id);
        } else {
          alert('User not found. Please register.');
        }
      }
      setIsAuthLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('TUC_SESSION_EMAIL');
    setActiveTab('dashboard');
    setSelectedTour(null);
  };

  // Tour Handlers
  const addTour = (data: Partial<Tour>) => {
    if (!currentUser) return;
    const newTour: Tour = {
      ...data as Tour,
      id: `tour_${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    storageService.addTour(newTour);
    setTours([...tours, newTour]);
  };

  const deleteTour = (id: string) => {
    storageService.deleteTour(id);
    setTours(tours.filter(t => t.id !== id));
    setAllGuests(allGuests.filter(g => g.tourId !== id));
    setAllExpenses(allExpenses.filter(e => e.tourId !== id));
    if (selectedTour?.id === id) setSelectedTour(null);
  };

  // Guest Handlers
  const addGuest = (data: Partial<Guest>) => {
    if (!currentUser || !selectedTour) return;
    const newGuest: Guest = {
      ...data as Guest,
      id: `guest_${Date.now()}`,
      tourId: selectedTour.id,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    storageService.addGuest(newGuest);
    setAllGuests([...allGuests, newGuest]);
  };

  const deleteGuest = (id: string) => {
    storageService.deleteGuest(id);
    setAllGuests(allGuests.filter(g => g.id !== id));
  };

  // Expense Handlers
  const addExpense = (data: Partial<Expense>) => {
    if (!currentUser || !selectedTour) return;
    const newExpense: Expense = {
      ...data as Expense,
      id: `exp_${Date.now()}`,
      tourId: selectedTour.id,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    storageService.addExpense(newExpense);
    setAllExpenses([...allExpenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    storageService.deleteExpense(id);
    setAllExpenses(allExpenses.filter(e => e.id !== id));
  };

  const globalStats = useMemo(() => {
    const income = allGuests.reduce((sum, g) => sum + Number(g.paidAmount), 0);
    const cost = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      totalTours: tours.length,
      totalGuests: allGuests.length,
      totalIncome: income,
      totalExpenses: cost,
      netProfit: income - cost
    };
  }, [tours, allGuests, allExpenses]);

  // Auth Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-black to-black">
        <Card className="w-full max-w-md p-8 bg-zinc-900 border-red-900/30 shadow-[0_0_50px_rgba(139,0,0,0.15)] animate-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-black text-red-700 tracking-tighter">TUC</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">Luxury Travel Agency Pro</p>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {isRegistering ? 'Create Your Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input required value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} placeholder="John Doe" />
              </div>
            )}
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input required type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} placeholder="admin@tuc.com" />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input required type="password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} placeholder="••••••••" />
            </div>
            
            <Button disabled={isAuthLoading} className="w-full h-14 text-lg mt-6 bg-gradient-to-r from-red-950 to-red-800 border-t border-red-700/50">
              {isAuthLoading ? 'Please wait...' : (isRegistering ? 'Register Agency' : 'Secure Login')}
            </Button>
          </form>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            {isRegistering ? 'Already have an account?' : "Don't have an agency account yet?"}{' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-red-600 font-bold hover:underline"
            >
              {isRegistering ? 'Login here' : 'Register here'}
            </button>
          </p>
        </Card>
      </div>
    );
  }

  // App Layout
  return (
    <Layout 
      userName={currentUser.name} 
      activeTab={activeTab} 
      onTabChange={(tab) => { setActiveTab(tab); setSelectedTour(null); }} 
      onLogout={handleLogout}
    >
      {selectedTour ? (
        <TourDetail 
          tour={selectedTour}
          guests={allGuests.filter(g => g.tourId === selectedTour.id)}
          expenses={allExpenses.filter(e => e.tourId === selectedTour.id)}
          onBack={() => setSelectedTour(null)}
          onAddGuest={addGuest}
          onDeleteGuest={deleteGuest}
          onAddExpense={addExpense}
          onDeleteExpense={deleteExpense}
        />
      ) : (
        <>
          {activeTab === 'dashboard' && <Dashboard stats={globalStats} />}
          {activeTab === 'tours' && (
            <TourList 
              tours={tours} 
              onAddTour={addTour} 
              onSelectTour={setSelectedTour} 
              onDeleteTour={deleteTour}
            />
          )}
          {activeTab === 'reports' && (
            <Reports 
              tours={tours} 
              allGuests={allGuests} 
              allExpenses={allExpenses} 
            />
          )}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto py-10 space-y-6">
              <Card className="p-8 border-red-900/20">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-red-900 flex items-center justify-center text-4xl font-bold shadow-2xl">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                    <p className="text-zinc-500">{currentUser.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-red-950/30 text-red-500 border border-red-900/30 rounded-full text-xs font-bold uppercase tracking-widest">
                      Agency Owner
                    </span>
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Member Since</span>
                    <span className="font-medium">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subscription Plan</span>
                    <span className="font-medium text-amber-500">Professional (Lifetime)</span>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="danger" className="w-full mt-8">Sign Out Safely</Button>
              </Card>
              <Card className="p-6 border-zinc-800 text-center">
                <p className="text-zinc-500 text-sm">Trip Up Cumilla Management Suite v1.0.4</p>
                <p className="text-zinc-600 text-xs mt-1">&copy; 2024 Trip Up Cumilla (TUC). All rights reserved.</p>
              </Card>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
