
import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '../components/SharedUI.tsx';
import { Users, Map, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TourStats } from '../types.ts';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  stats: TourStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const [aiInsight, setAiInsight] = useState<string>('Analyzing your agency performance...');
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    const fetchAiInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Act as a senior travel agency business consultant. Review these stats for "Trip Up Cumilla":
            Total Tours: ${stats.totalTours}
            Total Guests: ${stats.totalGuests}
            Total Income: ৳${stats.totalIncome}
            Net Profit: ৳${stats.netProfit}
            Provide a 2-sentence sharp business insight or strategic recommendation for the agency owner.`,
          config: {
            temperature: 0.7,
            maxOutputTokens: 150,
          }
        });
        setAiInsight(response.text || "Your agency is performing well. Focus on customer retention for higher profits.");
      } catch (error) {
        console.error("AI Insight failed", error);
        setAiInsight("Maintain your current momentum and focus on expanding tour destinations.");
      } finally {
        setIsAiLoading(false);
      }
    };

    if (stats.totalTours > 0) {
      fetchAiInsight();
    } else {
      setAiInsight("Start by creating your first tour to see strategic business insights here.");
      setIsAiLoading(false);
    }
  }, [stats]);

  const chartData = useMemo(() => [
    { name: 'Week 1', revenue: stats.totalIncome * 0.15, profit: stats.netProfit * 0.1 },
    { name: 'Week 2', revenue: stats.totalIncome * 0.45, profit: stats.netProfit * 0.35 },
    { name: 'Week 3', revenue: stats.totalIncome * 0.70, profit: stats.netProfit * 0.6 },
    { name: 'Week 4', revenue: stats.totalIncome, profit: stats.netProfit },
  ], [stats]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, Traveler</h2>
          <p className="text-zinc-400 mt-1">Here's how Trip Up Cumilla is performing today.</p>
        </div>
        
        <div className="bg-red-900/10 border border-red-900/20 p-4 rounded-2xl flex items-start space-x-3 max-w-md">
          <BrainCircuit className="text-red-500 shrink-0 mt-1" size={20} />
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center">
              AI Strategic Insight <Sparkles size={10} className="ml-1" />
            </p>
            <p className={`text-xs text-zinc-300 leading-relaxed ${isAiLoading ? 'animate-pulse' : ''}`}>
              {aiInsight}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tours" 
          value={stats.totalTours} 
          icon={<Map className="text-red-500" />} 
          trend="+12%"
          positive={true}
        />
        <StatCard 
          title="Total Guests" 
          value={stats.totalGuests} 
          icon={<Users className="text-blue-500" />} 
          trend="+5.4%"
          positive={true}
        />
        <StatCard 
          title="Total Revenue" 
          value={`৳${stats.totalIncome.toLocaleString()}`} 
          icon={<DollarSign className="text-emerald-500" />} 
          trend="+8%"
          positive={true}
        />
        <StatCard 
          title="Net Profit" 
          value={`৳${stats.netProfit.toLocaleString()}`} 
          icon={<TrendingUp className="text-amber-500" />} 
          trend={stats.netProfit < 0 ? "-2%" : "+15%"}
          positive={stats.netProfit >= 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Revenue Overview</h3>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-900 rounded-full"></div>
                <span className="text-zinc-400">Revenue</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-zinc-400">Profit</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b0000" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b0000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${Math.floor(val/1000)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8b0000" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              <Area type="monotone" dataKey="profit" stroke="#ef4444" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {stats.totalTours === 0 ? (
              <div className="text-center py-10">
                <p className="text-zinc-500 italic">No recent tours created</p>
              </div>
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-800 shadow-[0_0_10px_rgba(139,0,0,0.5)]"></div>
                  <div>
                    <p className="text-sm font-medium">Activity update synchronized</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{i}h ago</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; positive: boolean }> = ({ title, value, icon, trend, positive }) => (
  <Card className="p-6 transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-800 rounded-xl">{icon}</div>
      <div className={`flex items-center space-x-1 text-xs font-bold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        <span>{trend}</span>
      </div>
    </div>
    <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </Card>
);

export default Dashboard;
