import React, { useState, useEffect } from 'react';
import { getProjects } from '../api';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import { ChevronDown, Filter, DollarSign } from 'lucide-react';

const PriorityQueue = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [filters, setFilters] = useState({
    state: '',
    status: '',
    risk: '',
    min_amount: '',
    max_amount: ''
  });

  useEffect(() => {
    setLoading(true);
    // Clean filters to only send fields with active values
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    
    getProjects(1, 20, 'risk_score', activeFilters).then(data => {
      setProjects(data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Priority Queue</h2>
          <span className="bg-[#00C9A7] bg-opacity-20 text-[#00C9A7] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Live</span>
        </div>
        
        <button className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#222]">
          Sort by: Risk Score
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="bg-[#121212] border border-[#1E1E1E] rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end shadow-md">
        <div className="flex items-center gap-2 mr-2 text-gray-400 font-semibold text-sm">
          <Filter className="w-4 h-4" />
          Filters:
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider px-1">State Focus</label>
          <select 
            name="state" 
            value={filters.state} 
            onChange={handleFilterChange}
            className="bg-[#0A0A0A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 w-40 focus:border-[#00C9A7] focus:outline-none appearance-none"
          >
            <option value="">All States</option>
            <option value="Andaman And Nicobar Islands">Andaman And Nicobar Islands</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Dadra And Nagar Haveli And Daman And Diu">Dadra And Nagar Haveli And Daman And Diu</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu And Kashmir">Jammu And Kashmir</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider px-1">Status</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className="bg-[#0A0A0A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 w-36 focus:border-[#00C9A7] focus:outline-none appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Stalled / Delayed">Stalled</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider px-1">Risk Threshold</label>
          <select 
            name="risk" 
            value={filters.risk} 
            onChange={handleFilterChange}
            className="bg-[#0A0A0A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 w-48 focus:border-[#00C9A7] focus:outline-none appearance-none"
          >
            <option value="">Full Spectrum</option>
            <option value="Critical Audit Required">Critical Audit</option>
            <option value="Financial Irregularity">Financial Irregularity</option>
            <option value="Systemic Delay">Systemic Delay</option>
            <option value="High Priority">High Priority</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider px-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Financial Range</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              name="min_amount" 
              placeholder="Min ₹" 
              value={filters.min_amount} 
              onChange={handleFilterChange}
              className="bg-[#0A0A0A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 w-24 focus:border-[#00C9A7] focus:outline-none"
            />
            <span className="text-gray-600">-</span>
            <input 
              type="number" 
              name="max_amount" 
              placeholder="Max ₹" 
              value={filters.max_amount} 
              onChange={handleFilterChange}
              className="bg-[#0A0A0A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 w-24 focus:border-[#00C9A7] focus:outline-none"
            />
          </div>
        </div>

        <button 
          onClick={() => setFilters({ state: '', status: '', risk: '', min_amount: '', max_amount: '' })}
          className="ml-auto text-xs text-gray-500 hover:text-white underline decoration-dashed underline-offset-2 transition-colors mb-2"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="text-[#00C9A7] py-10 text-center flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-[#00C9A7] border-t-transparent rounded-full animate-spin"></div>
          Scanning Telemetry...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-gray-500 py-10 text-center border-2 border-dashed border-[#1E1E1E] rounded-xl">
          No anomaly projects matched your specific filter metrics.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <ProjectCard 
              key={proj.Work_Id || i} 
              project={proj} 
              onClick={() => setSelectedProject(proj)} 
            />
          ))}
        </div>
      )}

      {/* Render the Project Details Modal if a project is selected */}
      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default PriorityQueue;
