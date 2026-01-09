
import React, { useState } from 'react';
import { Card, Button, Input, Label, Select } from '../components/SharedUI';
import { ArrowLeft, Plus, Trash2, Printer, Users, CreditCard, PieChart, ShoppingBag, Phone, Map, AlertCircle, Banknote } from 'lucide-react';
import { Tour, Guest, Expense } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';

interface TourDetailProps {
  tour: Tour;
  guests: Guest[];
  expenses: Expense[];
  onBack: () => void;
  onAddGuest: (guest: Partial<Guest>) => void;
  onDeleteGuest: (id: string) => void;
  onAddExpense: (expense: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

const TourDetail: React.FC<TourDetailProps> = ({ 
  tour, guests, expenses, onBack, onAddGuest, onDeleteGuest, onAddExpense, onDeleteExpense 
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'expenses' | 'summary'>('guests');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [guestForm, setGuestForm] = useState<Partial<Guest>>({
    guestName: '', mobileNumber: '', seatNumber: '', paidAmount: 0, paymentStatus: 'Unpaid'
  });

  const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({
    category: 'Other', amount: 0, note: ''
  });

  const tourBasePrice = tour.pricePerSeat || 0;
  const totalCollected = guests.reduce((sum, g) => sum + Number(g.paidAmount), 0);
  const totalUnpaid = guests.reduce((sum, g) => {
    const unpaid = Math.max(0, tourBasePrice - Number(g.paidAmount));
    return sum + unpaid;
  }, 0);
  const projectedRevenue = totalCollected + totalUnpaid;
  
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const currentNetProfit = totalCollected - totalExpenses;
  const projectedNetProfit = projectedRevenue - totalExpenses;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print View Only - Force shown only during media print */}
      <div className="print-only p-12 text-black bg-white">
        <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-8">
          <div>
            <h1 className="text-5xl font-black text-black tracking-tighter">TUC</h1>
            <p className="text-sm font-bold uppercase tracking-[0.3em] mt-1">Trip Up Cumilla</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold border-b border-black mb-1">OFFICIAL GUEST REPORT</h2>
            <p className="text-md font-medium">{tour.tourName}</p>
            <p className="text-sm text-gray-600">Event Date: {new Date(tour.tourDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8 text-xs font-bold uppercase">
          <div className="border border-black p-4 text-center">
            <p className="text-gray-500 mb-1">Host</p>
            <p className="text-lg">{tour.hostName}</p>
          </div>
          <div className="border border-black p-4 text-center">
            <p className="text-gray-500 mb-1">Base Price</p>
            <p className="text-lg">৳{tourBasePrice}</p>
          </div>
          <div className="border border-black p-4 text-center">
            <p className="text-gray-500 mb-1">Total Guests</p>
            <p className="text-lg">{guests.length}</p>
          </div>
          <div className="border border-black p-4 text-center bg-gray-50">
            <p className="text-gray-500 mb-1">Pending Balance</p>
            <p className="text-lg text-red-600">৳{totalUnpaid}</p>
          </div>
        </div>

        <table className="w-full border-collapse border-2 border-black text-[11px]">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-black">
              <th className="border-r border-black p-3 text-left w-10">#</th>
              <th className="border-r border-black p-3 text-left">GUEST NAME</th>
              <th className="border-r border-black p-3 text-left">CONTACT</th>
              <th className="border-r border-black p-3 text-center w-20">SEAT</th>
              <th className="border-r border-black p-3 text-right">PAID (৳)</th>
              <th className="p-3 text-right">UNPAID (৳)</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, idx) => {
              const unpaid = Math.max(0, tourBasePrice - Number(g.paidAmount));
              return (
                <tr key={g.id} className="border-b border-gray-300">
                  <td className="border-r border-black p-3 text-gray-500">{idx + 1}</td>
                  <td className="border-r border-black p-3 font-bold">{g.guestName.toUpperCase()}</td>
                  <td className="border-r border-black p-3">{g.mobileNumber}</td>
                  <td className="border-r border-black p-3 text-center">{g.seatNumber}</td>
                  <td className="border-r border-black p-3 text-right">৳{g.paidAmount}</td>
                  <td className="p-3 text-right font-black {unpaid > 0 ? 'text-red-600' : 'text-gray-400'}">
                    ৳{unpaid}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-gray-100 border-t-2 border-black">
              <td colSpan={4} className="border-r border-black p-4 text-right">GRAND TOTALS</td>
              <td className="border-r border-black p-4 text-right">৳{totalCollected}</td>
              <td className="p-4 text-right text-red-600">৳{totalUnpaid}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-end">
            <div className="text-[10px] text-gray-400">
                <p>Generated on: {new Date().toLocaleString()}</p>
                <p>System Ref: TUC-GEN-{tour.id.slice(-6).toUpperCase()}</p>
            </div>
            <div className="text-center w-48">
                <div className="border-b-2 border-black mb-1 h-10"></div>
                <p className="text-[10px] font-bold uppercase">Authorized Signatory</p>
            </div>
        </div>
      </div>

      <div className="no-print flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Tours
        </button>
        <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2">
          <Printer size={18} />
          <span>Print Guest List</span>
        </Button>
      </div>

      <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{tour.tourName}</h2>
                <p className="text-red-500 font-medium mt-1">{new Date(tour.tourDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Base Price</p>
                <p className="text-2xl font-black text-emerald-500">৳{tourBasePrice}</p>
              </div>
            </div>
            <p className="text-zinc-400 mt-4 leading-relaxed">{tour.description || "No description provided."}</p>
          </div>
          
          <div className="flex border-t border-zinc-800 mt-8 pt-4 space-x-8">
            <div className="flex-1">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Booked Seats</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="bg-red-900 h-full" style={{ width: `${Math.min((guests.length / tour.totalSeats) * 100, 100)}%` }}></div>
                </div>
                <span className="text-sm font-bold">{guests.length}/{tour.totalSeats}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Status</p>
              <span className="px-3 py-1 bg-emerald-950/30 text-emerald-500 rounded-full text-xs font-bold border border-emerald-900/30">Active</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-950/10 to-zinc-950 border-red-900/10">
          <h3 className="text-xl font-bold mb-6">Financial Snapshot</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
              <span className="text-sm text-zinc-400">Total Collected</span>
              <span className="font-bold text-white">৳{totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
              <span className="text-sm text-zinc-400">Total Unpaid</span>
              <span className="font-bold text-red-500">৳{totalUnpaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
              <span className="text-sm text-zinc-400">Total Expenses</span>
              <span className="font-bold text-rose-500">৳{totalExpenses.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-red-900 shadow-lg shadow-red-900/10 rounded-xl mt-4">
              <p className="text-xs font-bold text-red-200 uppercase tracking-widest mb-1">Current Net Profit</p>
              <p className="text-2xl font-black text-white">৳{currentNetProfit.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="no-print">
        <div className="flex border-b border-zinc-800 space-x-8 mb-6 overflow-x-auto">
          {[
            { id: 'guests', label: 'Guests List', icon: Users },
            { id: 'expenses', label: 'Expenses', icon: ShoppingBag },
            { id: 'summary', label: 'Financial Summary', icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all font-medium whitespace-nowrap ${
                activeTab === tab.id ? 'border-red-900 text-red-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'guests' && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Bookings ({guests.length})</h3>
              <Button onClick={() => setShowGuestModal(true)} className="flex items-center space-x-2">
                <Plus size={18} />
                <span>Add Guest</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guests.map((g) => {
                const unpaid = Math.max(0, tourBasePrice - Number(g.paidAmount));
                return (
                  <Card key={g.id} className="p-5 border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{g.guestName}</h4>
                        <div className="flex items-center text-zinc-500 text-sm">
                          <Phone size={14} className="mr-1.5" />
                          {g.mobileNumber}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        unpaid === 0 ? 'bg-emerald-950/30 text-emerald-500' : 'bg-red-950/30 text-red-500'
                      }`}>
                        {unpaid === 0 ? 'Fully Paid' : 'Due'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Seat</span>
                        <span className="text-sm font-bold text-zinc-300">{g.seatNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Paid</span>
                        <span className="text-sm font-bold text-emerald-500">৳{g.paidAmount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Unpaid</span>
                        <span className={`text-sm font-black ${unpaid > 0 ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`}>৳{unpaid}</span>
                      </div>
                    </div>
                    
                    <button onClick={() => onDeleteGuest(g.id)} className="w-full mt-4 pt-4 border-t border-zinc-800/30 py-2 text-zinc-600 hover:text-rose-500 transition-colors flex items-center justify-center space-x-1">
                      <Trash2 size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Remove</span>
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Tour Expenses</h3>
              <Button onClick={() => setShowExpenseModal(true)} className="flex items-center space-x-2">
                <Plus size={18} />
                <span>Add Expense</span>
              </Button>
            </div>
            
            <Card className="overflow-hidden border-zinc-800">
              <table className="w-full text-left">
                <thead className="bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-950/20 text-red-400 rounded-md text-xs font-bold">{e.category}</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">{e.note || '-'}</td>
                      <td className="px-6 py-4 text-right font-bold">৳{e.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onDeleteExpense(e.id)} className="text-zinc-600 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-emerald-950/10 border-emerald-900/20">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Projected Income</p>
                <p className="text-3xl font-black text-emerald-500">৳{projectedRevenue.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 mt-2">Sum of all collected + all pending dues</p>
              </Card>
              <Card className="p-6 bg-red-950/10 border-red-900/20">
                <p className="text-xs font-bold text-red-600 uppercase mb-1">Projected Profit</p>
                <p className="text-3xl font-black text-red-500">৳{projectedNetProfit.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 mt-2">Expected after all dues are paid</p>
              </Card>
              <Card className="p-6 bg-blue-950/10 border-blue-900/20">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Avg Collection / Seat</p>
                <p className="text-3xl font-black text-blue-500">৳{guests.length > 0 ? Math.round(totalCollected / guests.length).toLocaleString() : 0}</p>
                <p className="text-[10px] text-zinc-500 mt-2">Efficiency per booked seat</p>
              </Card>
            </div>
            
            <Card className="p-8 border-zinc-800 bg-zinc-900/30">
              <h3 className="text-xl font-bold mb-6">Visual Dues Monitor</h3>
              <div className="space-y-4">
                {guests.map(g => {
                   const unpaid = Math.max(0, tourBasePrice - Number(g.paidAmount));
                   const paidPerc = Math.min(100, (Number(g.paidAmount) / tourBasePrice) * 100);
                   return (
                     <div key={g.id} className="group">
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-zinc-400">{g.guestName}</span>
                          <span className={unpaid > 0 ? "text-red-500" : "text-emerald-500"}>
                            {unpaid > 0 ? `Pending ৳${unpaid}` : "Fully Paid"}
                          </span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${unpaid === 0 ? "bg-emerald-500" : "bg-red-800"}`} style={{ width: `${paidPerc}%` }}></div>
                        </div>
                     </div>
                   )
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {showGuestModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 bg-zinc-900 shadow-2xl border-red-900/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Guest</h3>
              <button onClick={() => setShowGuestModal(false)} className="text-zinc-500 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onAddGuest(guestForm); setShowGuestModal(false); setGuestForm({ guestName: '', mobileNumber: '', seatNumber: '', paidAmount: 0, paymentStatus: 'Unpaid' }); }} className="space-y-4">
              <div>
                <Label>Guest Name</Label>
                <Input required value={guestForm.guestName} onChange={(e) => setGuestForm({...guestForm, guestName: e.target.value})} placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mobile Number</Label>
                  <Input required value={guestForm.mobileNumber} onChange={(e) => setGuestForm({...guestForm, mobileNumber: e.target.value})} placeholder="017..." />
                </div>
                <div>
                  <Label>Seat Number</Label>
                  <Input required value={guestForm.seatNumber} onChange={(e) => setGuestForm({...guestForm, seatNumber: e.target.value})} placeholder="e.g. A1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Paid Amount (৳)</Label>
                  <Input required type="number" value={guestForm.paidAmount} onChange={(e) => setGuestForm({...guestForm, paidAmount: Number(e.target.value)})} />
                  <p className="text-[10px] text-zinc-500 mt-1">Total Due: ৳{Math.max(0, tourBasePrice - (guestForm.paidAmount || 0))}</p>
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <Select value={guestForm.paymentStatus} onChange={(e) => setGuestForm({...guestForm, paymentStatus: e.target.value as any})}>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                  </Select>
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <Button type="button" variant="ghost" onClick={() => setShowGuestModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Add Guest</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showExpenseModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 bg-zinc-900 shadow-2xl border-red-900/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Record Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-zinc-500 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onAddExpense(expenseForm); setShowExpenseModal(false); setExpenseForm({ category: 'Other', amount: 0, note: '' }); }} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value as any})}>
                  {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </Select>
              </div>
              <div>
                <Label>Amount (৳)</Label>
                <Input required type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({...expenseForm, amount: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Note / Purpose</Label>
                <Input value={expenseForm.note} onChange={(e) => setExpenseForm({...expenseForm, note: e.target.value})} placeholder="Hotel payment, Fuel, etc." />
              </div>
              <div className="pt-4 flex space-x-3">
                <Button type="button" variant="ghost" onClick={() => setShowExpenseModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Save Expense</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
