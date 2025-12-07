import React from 'react';
import { Layers, PlusCircle, Search, Bell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-fintech-purple to-fintech-teal text-white p-1.5 rounded-lg">
            <Layers size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            FinCompare
          </span>
        </div>

        {/* Center Control - Simulated Dropdown */}
        <div className="hidden md:flex items-center gap-3 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
            <div className="flex -space-x-2 overflow-hidden px-2">
               <div className="h-6 w-6 rounded-full bg-fintech-purple text-xs flex items-center justify-center text-white ring-2 ring-white font-bold">Q</div>
               <div className="h-6 w-6 rounded-full bg-fintech-teal text-xs flex items-center justify-center text-white ring-2 ring-white font-bold">N</div>
               <div className="h-6 w-6 rounded-full bg-fintech-gold text-xs flex items-center justify-center text-white ring-2 ring-white font-bold">S</div>
            </div>
            <span className="text-xs font-semibold text-slate-500">3 Funds Selected</span>
            <button className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 shadow-sm transition-all">
               <PlusCircle size={14} className="text-fintech-purple" />
               Add Fund
            </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
           <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
             <Search size={20} />
           </button>
           <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
             <Bell size={20} />
             <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
           </button>
           <div className="h-8 w-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 border-2 border-white shadow-md"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
