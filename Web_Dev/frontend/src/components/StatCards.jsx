import React, { useState, useEffect } from 'react';
import { getStats } from '../api';
import { Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

const StatCards = () => {
  const [stats, setStats] = useState({ total_projects: 0, requires_review: 0, high_priority: 0 });

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 mb-10">
      <div className="bg-[#121212] rounded-xl p-6 border border-[#1E1E1E] flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 tracking-wider font-semibold mb-2 uppercase">Total Projects</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">{stats.total_projects.toLocaleString()}</h2>
        </div>
        <Activity className="w-10 h-10 text-gray-700" />
      </div>

      <div className="bg-[#121212] rounded-xl p-6 border border-[#2D1B0F] flex items-center justify-between relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(245,158,11,0.05)] to-transparent" />
        <div className="relative z-10">
          <p className="text-xs text-[#F59E0B] tracking-wider font-semibold mb-2 uppercase">Requires Review</p>
          <h2 className="text-4xl font-bold text-[#F59E0B] tracking-tight">{stats.requires_review.toLocaleString()}</h2>
        </div>
        <AlertTriangle className="w-10 h-10 text-[#F59E0B] opacity-20 relative z-10" />
      </div>

      <div className="bg-[#121212] rounded-xl p-6 border border-[#2D0B12] flex items-center justify-between relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(244,63,94,0.05)] to-transparent" />
        <div className="relative z-10">
          <p className="text-xs text-[#F43F5E] tracking-wider font-semibold mb-2 uppercase">High Priority</p>
          <h2 className="text-4xl font-bold text-[#F43F5E] tracking-tight">{stats.high_priority.toLocaleString()}</h2>
        </div>
        <ShieldAlert className="w-10 h-10 text-[#F43F5E] opacity-20 relative z-10" />
      </div>
    </div>
  );
};

export default StatCards;
