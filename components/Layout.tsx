
import React from 'react';
import { Home, Map, FileText, User as UserIcon, LogOut, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout, userName }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden no-print">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-red-900/30">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-red-700 tracking-tighter">TUC</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Trip Up Cumilla</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'tours', label: 'My Tours', icon: Map },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'profile', label: 'Profile', icon: UserIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-red-900 text-white shadow-lg shadow-red-900/20' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-red-900/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold truncate w-32">{userName}</p>
              <p className="text-xs text-zinc-500">Premium Account</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 md:hidden flex justify-between items-center border-b border-red-900/20">
          <h1 className="text-xl font-bold text-red-700">TUC</h1>
          <button onClick={onLogout} className="text-zinc-400"><LogOut size={20}/></button>
        </header>
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-zinc-900 border-t border-red-900/30 flex justify-around py-4 px-2 z-20">
        {[
          { id: 'dashboard', icon: Home },
          { id: 'tours', icon: Map },
          { id: 'reports', icon: FileText },
          { id: 'profile', icon: UserIcon },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              activeTab === item.id ? 'bg-red-900 text-white' : 'text-zinc-500'
            }`}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
