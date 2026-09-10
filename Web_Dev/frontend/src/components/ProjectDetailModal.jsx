import React, { useState, useEffect } from 'react';
import { X, MapPin, Sparkles, Map } from 'lucide-react';
import { generateProjectSummary } from '../api';

const ProjectDetailModal = ({ project, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  // Reset state when a new project is clicked to prevent previous summaries from persisting
  useEffect(() => {
    setIsGenerating(false);
    setSummaryText("");
  }, [project]);

  if (!project) return null;

  const getRiskColor = (score) => {
    if (score > 0.7) return '#F43F5E';
    if (score > 0.4) return '#F59E0B';
    return '#10B981';
  };

  const riskColor = getRiskColor(project.Anomaly_Score_Ensemble);
  
  // Guarantee div by zero doesn't occur and bounded strictly to 100%
  const progressPct = Math.min(100, Math.max(0, project.sanctioned_amount > 0 ? (project.amount_disbursed / project.sanctioned_amount) * 100 : 0));

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setSummaryText("");
    try {
      const data = await generateProjectSummary(project);
      setSummaryText(data.summary);
    } catch (err) {
      setSummaryText("Intelligence uplink failed. Fallback error details: Connection Refused.");
    } finally {
      setIsGenerating(false);
    }
  };

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
          
          {/* Left Column: Project Overview & Forensics */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            <div className="space-y-4">
              <h3 className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.15em]">Project Overview</h3>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Location</p>
                  <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                    <MapPin className="w-3 h-3 text-[#00C9A7]" />
                    <span className="truncate">{project.constituency}, {project.state}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Status</p>
                  <p className="text-white font-medium text-sm">{project.status_text}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Vendor</p>
                  <p className="text-white font-medium text-sm truncate">{project.vendor}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Timeline Delay</p>
                  <p className="text-[#F43F5E] font-medium text-sm">{project.sanction_delay_days} days</p>
                </div>
              </div>
            </div>

            {/* AI Forensic Intelligence Flags */}
            <div className="mt-2 bg-[#1A1112] border border-[#3A181C] rounded-xl p-4">
               <h3 className="text-[11px] text-[#F43F5E] font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                 <Sparkles className="w-3 h-3" />
                 Forensic Intelligence
               </h3>
               <ul className="space-y-2 text-xs">
                 {project.is_round_amount === 1 && (
                   <li className="flex items-start gap-2 text-red-200">
                     <span className="text-[#F43F5E] block mt-0.5">•</span> 
                     Suspicious flat-round sanction figure detected.
                   </li>
                 )}
                 {project.completed_no_image === 1 && (
                   <li className="flex items-start gap-2 text-red-200">
                     <span className="text-[#F43F5E] block mt-0.5">•</span> 
                     Status marked completed without photographic evidence.
                   </li>
                 )}
                 {project.is_duplicate_desc === 1 && (
                   <li className="flex items-start gap-2 text-red-200">
                     <span className="text-[#F43F5E] block mt-0.5">•</span> 
                     Highly duplicate project description (Fraud Risk).
                   </li>
                 )}
                 {project.has_banned_keyword === 1 && (
                   <li className="flex items-start gap-2 text-red-200">
                     <span className="text-[#F43F5E] block mt-0.5">•</span> 
                     Statutory violation / Banned keyword found in scope.
                   </li>
                 )}
                 {/* Fallback if no specific discrete flags but high anomaly score */}
                 {project.is_round_amount === 0 && project.completed_no_image === 0 && project.is_duplicate_desc === 0 && project.has_banned_keyword === 0 && (
                   <li className="flex items-start gap-2 text-orange-200">
                     <span className="text-[#F59E0B] block mt-0.5">•</span>
                     Anomalous multi-dimensional patterns detected in funding timeline.
                   </li>
                 )}
               </ul>
            </div>
            
          </div>

          {/* Right Column: Financials */}
          <div className="md:col-span-3 bg-[#16161A] border border-[#232328] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.15em] mb-5">Financial Telemetry</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#0F0F11] p-3 rounded-lg border border-[#1E1E1E]">
                  <span className="text-gray-400 text-xs font-semibold uppercase">Recommended Amount</span>
                  <span className="text-gray-300 font-mono tracking-tight text-sm">₹{project.recommended_amount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between items-center bg-[#0F0F11] p-3 rounded-lg border border-[#1E1E1E]">
                  <span className="text-gray-400 text-xs font-semibold uppercase">Sanctioned Amount</span>
                  <span className="text-white font-bold font-mono tracking-tight">₹{project.sanctioned_amount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between items-center bg-[rgba(0,201,167,0.05)] p-3 rounded-lg border border-[rgba(0,201,167,0.2)]">
                  <span className="text-[#00C9A7] text-xs font-semibold uppercase tracking-wider">Current Expenditure</span>
                  <span className="text-[#00C9A7] font-bold font-mono tracking-tight text-lg">₹{project.amount_disbursed.toLocaleString('en-IN')}</span>
                </div>

                {/* Progress Bar Container */}
                <div className="pt-3 px-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    <span>Fund Disbursal Progress</span>
                    <span className="text-[#00C9A7]">{Math.round(progressPct)}%</span>
                  </div>
                  <div className="w-full bg-[#080808] h-2.5 rounded-full overflow-hidden border border-[#222]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00C9A7] to-[#00A388] rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)] transition-all duration-1000 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Context Stats */}
            <div className="mt-6 flex justify-between border-t border-[#232328] pt-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">State Avg Delay</p>
                <p className="text-gray-300 text-xs">{project.completion_days} days</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">MP Average Ticket Size</p>
                <p className="text-gray-300 text-xs font-mono">₹{project.mp_avg_amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* AI Intelligence Block Container */}
        {(isGenerating || summaryText.length > 0) ? (
          <div className="bg-[#1A1112] mx-6 mb-6 p-5 border border-[#3A181C] rounded-xl relative overflow-hidden">
            
            <h3 className="text-[11px] text-[#F43F5E] font-bold uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Forensic Intelligence Summary
            </h3>
            
            {isGenerating ? (
              <div className="flex items-center gap-3 text-red-200 text-sm italic font-['Inter']">
                <div className="w-4 h-4 border-2 border-[#F43F5E] border-t-transparent rounded-full animate-spin"></div>
                Analyzing financial telemetry patterns via MPLADSGuard AI Studio...
              </div>
            ) : (
              <p className="text-red-100 text-sm leading-relaxed whitespace-pre-wrap font-['Inter']">
                {summaryText}
              </p>
            )}
          </div>
        ) : null}

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
            <button 
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                isGenerating 
                  ? 'bg-[#1A1112] text-red-300 border-red-900 opacity-70 cursor-not-allowed'
                  : 'bg-[rgba(0,201,167,0.1)] text-[#00C9A7] border-[rgba(0,201,167,0.3)] hover:bg-[rgba(0,201,167,0.15)] shadow-[0_0_10px_rgba(0,201,167,0.2)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Processing...' : 'Generate Summary'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetailModal;
