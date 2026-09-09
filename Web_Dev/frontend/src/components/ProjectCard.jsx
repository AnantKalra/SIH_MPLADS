import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const getRiskColor = (score) => {
    if (score > 0.7) return '#F43F5E';
    if (score > 0.4) return '#F59E0B';
    return '#10B981';
  };

  const color = getRiskColor(project.risk_score);

  return (
    <div 
      className="bg-[#121212] rounded-xl p-5 border border-[#1E1E1E] relative overflow-hidden group hover:border-gray-700 transition-colors cursor-pointer"
      style={{ borderTop: `2px solid ${color}` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div 
            className="inline-block px-3 py-1 rounded border text-xs font-semibold mb-3 tracking-wider bg-opacity-10"
            style={{ 
              borderColor: `${color}40`, 
              color: color,
              backgroundColor: `${color}15`
            }}
          >
            PRJ-{project.Work_Id}
          </div>
          <div className="flex items-center text-xs text-gray-400 gap-1 mb-2">
            <MapPin className="w-3 h-3" />
            <span>{project.constituency}, {project.state}</span>
          </div>
        </div>
        
        <div 
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm bg-[#121212] flex-shrink-0"
          style={{ borderColor: color, color: color }}
        >
          {project.risk_score.toFixed(2)}
        </div>
      </div>

      <h3 className="text-white font-semibold text-lg leading-snug mb-6 line-clamp-2 min-h-[56px]">
        {project.description}
      </h3>

      <div className="flex justify-between items-end border-t border-[#1E1E1E] pt-4 mt-auto">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Sanctioned</p>
          <p className="text-white font-medium">₹{(project.sanctioned_amount).toLocaleString('en-IN')}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default ProjectCard;
