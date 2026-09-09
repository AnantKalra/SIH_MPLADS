import React, { useState, useEffect } from 'react';
import { getProjects } from '../api';
import ProjectCard from './ProjectCard';
import { ChevronDown } from 'lucide-react';

const PriorityQueue = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data.data || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Priority Queue</h2>
          <span className="bg-[#00C9A7] bg-opacity-20 text-[#00C9A7] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Live</span>
        </div>
        
        <button className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#222]">
          Sort by: Risk Score
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 py-10 text-center">Loading priority queue...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <ProjectCard key={proj.Work_Id || i} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityQueue;
