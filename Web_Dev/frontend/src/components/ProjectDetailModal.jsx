import React from 'react';
import { X, MapPin, Sparkles, Map } from 'lucide-react';

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  const getRiskColor = (score) => {
    if (score > 0.7) return '#F43F5E';
    if (score > 0.4) return '#F59E0B';
    return '#10B981';
  };

  const riskColor = getRiskColor(project.Anomaly_Score_Ensemble);
  // Guarantee div by zero doesn't occur and bounded strictly to 100%
  const progressPct = Math.min(100, Math.max(0, project.sanctioned_amount > 0 ? (project.amount_disbursed / project.sanctioned_amount) * 100 : 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-[#0F0F11] border border-[#1E1E1E] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative font-['Inter']">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between p-6 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-4 pr-10">
            <span 
              className="px-3 py-1 rounded bg-opacity-10 border text-xs font-semibold tracking-wider whitespace-nowrap"
              style={{ borderColor: `${riskColor}40`, color: riskColor, backgroundColor: `${riskColor}15` }}
            >
              PRJ-{project.Work_Id}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">
              {project.description}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Left Column: Project Overview */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.15em]">Project Overview</h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#00C9A7]" />
                  <span className="truncate">{project.constituency}, {project.state}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-white font-medium text-sm">{project.status_text}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Implementing Vendor</p>
                <p className="text-white font-medium text-sm">{project.vendor}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Risk Score</p>
                <p className="font-bold text-sm" style={{ color: riskColor }}>
                  {project.Anomaly_Score_Ensemble.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Financials */}
          <div className="md:col-span-3 bg-[#16161A] border border-[#232328] rounded-xl p-5">
            <h3 className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.15em] mb-5">Financials</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Sanctioned Amount</span>
                <span className="text-white font-bold font-mono tracking-tight">₹{project.sanctioned_amount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Current Expenditure</span>
                <span className="text-[#00C9A7] font-bold font-mono tracking-tight">₹{project.amount_disbursed.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2">
                <div className="w-full bg-[#080808] h-2 rounded-full overflow-hidden border border-[#222]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00C9A7] to-[#00A388] rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer Bar */}
        <div className="bg-[#121215] border-t border-[#1E1E1E] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Sparkles className="w-4 h-4 text-[#00C9A7]" />
            Intelligence Summary
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1E] text-white text-sm font-medium rounded-lg hover:bg-[#25252A] border border-[#2A2A30] transition-colors">
              <Map className="w-4 h-4" />
              Show on Map
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,201,167,0.1)] text-[#00C9A7] text-sm font-medium rounded-lg border border-[rgba(0,201,167,0.3)] hover:bg-[rgba(0,201,167,0.15)] shadow-[0_0_10px_rgba(0,201,167,0.2)] transition-all">
              <Sparkles className="w-4 h-4" />
              Generate Summary
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetailModal;
