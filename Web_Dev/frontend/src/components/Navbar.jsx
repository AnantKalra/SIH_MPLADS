import React from 'react';
import { Search, Bell, Shield, Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-[#1E1E1E] bg-[#0A0A0A]">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[rgba(0,201,167,0.1)]">
          <Shield className="w-6 h-6 text-[#00C9A7]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0 leading-none">MPLADS<span className="text-[#00C9A7]">GUARD</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">By Cybatics</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Project ID, State..."
            className="bg-[#121212] border border-[#1E1E1E] rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 w-80 focus:outline-none focus:border-[#00C9A7] transition-colors"
          />
        </div>
        <div className="h-6 w-px bg-[#1E1E1E]"></div>
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F43F5E] rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#00C9A7] flex items-center justify-center text-sm font-bold text-black cursor-pointer">
          AS
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
