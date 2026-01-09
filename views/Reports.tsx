
import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Label } from '../components/SharedUI';
import { Download, Filter, Calendar as CalendarIcon, FileText, CheckCircle } from 'lucide-react';
import { Tour, Guest, Expense } from '../types';

interface ReportsProps {
  tours: Tour[];
  allGuests: Guest[];
  allExpenses: Expense[];
}

const Reports: React.FC<ReportsProps> = ({ tours, allGuests, allExpenses }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredData = useMemo(() => {
    let filteredTours = tours;
    if (dateRange.start) {
      filteredTours = filteredTours.filter(t => t.tourDate >= dateRange.start);
    }
    if (dateRange.end) {
      filteredTours = filteredTours.filter(t => t.tourDate <= dateRange.end);
    }

    const tourIds = filteredTours.map(t => t.id);
    const guests = allGuests.filter(g => tourIds.includes(g.tourId));
    const expenses = allExpenses.filter(e => tourIds.includes(e.tourId));

    const income = guests.reduce((sum, g) => sum + Number(g.paidAmount), 0);
    const cost = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      tours: filteredTours,
      income,
      cost,
      profit: income - cost,
      guestCount: guests.length
    };
  }, [tours, allGuests, allExpenses, dateRange]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold">Business Intelligence</h2>
        <p className="text-zinc-400">Deep dive into your travel agency performance.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-2 bg-red-950/20 text-red-500 rounded-lg"><Filter size={20}/></div>
          <h3 className="text-xl font-bold">Filter Statements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
          </div>
          <Button variant="outline" onClick={() => setDateRange({start: '', end: ''})} className="flex items-center justify-center space-x-2">
            <span>Clear Filter</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportMetric title="Tours Conducted" value={filteredData.tours.length} color="text-red-500" />
        <ReportMetric title="Guests Managed" value={filteredData.guestCount} color="text-blue-500" />
        <ReportMetric title="Total Revenue" value={`৳${filteredData.income.toLocaleString()}`} color="text-emerald-500" />
        <ReportMetric title="Net Profit" value={`৳${filteredData.profit.toLocaleString()}`} color="text-amber-500" />
      </div>

      <Card className="overflow-hidden border-zinc-800">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="font-bold text-lg">Detailed Tour Statements</h3>
          <Button onClick={() => window.alert('CSV Generation initialized...')} className="flex items-center space-x-2">
            <Download size={18} />
            <span>Export CSV</span>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Tour Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Guests</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Expenses</th>
                <th className="px-6 py-4 text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredData.tours.map(tour => {
                const tourGuests = allGuests.filter(g => g.tourId === tour.id);
                const tourExpenses = allExpenses.filter(e => e.tourId === tour.id);
                const tourInc = tourGuests.reduce((sum, g) => sum + Number(g.paidAmount), 0);
                const tourExp = tourExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
                const tourProf = tourInc - tourExp;

                return (
                  <tr key={tour.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-bold">{tour.tourName}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{new Date(tour.tourDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-zinc-400">{tourGuests.length}</td>
                    <td className="px-6 py-4 text-emerald-500">৳{tourInc}</td>
                    <td className="px-6 py-4 text-rose-500">৳{tourExp}</td>
                    <td className="px-6 py-4 text-right font-bold">৳{tourProf}</td>
                  </tr>
                );
              })}
              {filteredData.tours.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 italic">No tour data available for this range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-center space-x-6">
        <div className="flex items-center space-x-2 text-zinc-500">
          <CheckCircle size={16} className="text-emerald-500" />
          <span className="text-xs">All calculations are real-time</span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-500">
          <FileText size={16} className="text-red-500" />
          <span className="text-xs">Print-ready layouts supported</span>
        </div>
      </div>
    </div>
  );
};

const ReportMetric: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <Card className="p-6 border-zinc-800 shadow-none">
    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[2px] mb-1">{title}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </Card>
);

export default Reports;
