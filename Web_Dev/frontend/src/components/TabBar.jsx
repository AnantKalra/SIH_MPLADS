import React from 'react';
import { LayoutDashboard, AlertTriangle, CheckSquare, Settings } from 'lucide-react';

const TabBar = () => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#121212] border border-[#1E1E1E] rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl z-50">
      <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
        <LayoutDashboard className="w-4 h-4 border-black" />
        Overview
      </button>
      <button className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-[#1E1E1E] px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
        <AlertTriangle className="w-4 h-4" />
        Risk Center
      </button>
      <button className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-[#1E1E1E] px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
        <CheckSquare className="w-4 h-4" />
        Verification
      </button>
      <button className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-[#1E1E1E] px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
        <Settings className="w-4 h-4" />
        Settings
      </button>
    </div>
  );
};

export default TabBar;
