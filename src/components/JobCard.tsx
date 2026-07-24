import React from 'react';
import { MapPin, Briefcase, Calendar, DollarSign, ArrowRight, MessageSquareCode } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  // Format creation relative time
  const getTimeAgo = (dateStr: string) => {
    try {
      const created = new Date(dateStr);
      const diffMs = Date.now() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return 'Just added';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/60 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-200 flex flex-col justify-between">
      {/* Top badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-3 h-3 mr-1" />
              {job.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <MapPin className="w-3 h-3 mr-1 text-amber-400" />
              {job.location}
            </span>
          </div>
          <span className="inline-flex items-center text-[11px] font-medium text-slate-400 whitespace-nowrap">
            <Calendar className="w-3 h-3 mr-1 text-slate-500" />
            {getTimeAgo(job.created_at)}
          </span>
        </div>

        {/* Job Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1">
          {job.title}
        </h3>

        {/* Company Name */}
        <p className="text-xs text-slate-400 font-medium mb-3 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
          {job.company_name || 'Verified KSA Employer'}
        </p>

        {/* Salary info if provided */}
        {job.salary && (
          <div className="mb-3 inline-flex items-center px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
            <DollarSign className="w-3.5 h-3.5 mr-0.5 text-amber-400" />
            <span>{job.salary}</span>
          </div>
        )}

        {/* Description Snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Card Footer: Apply Now Button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
          <MessageSquareCode className="w-3.5 h-3.5 text-emerald-400" />
          <span>Instant Contact</span>
        </div>

        <button
          onClick={() => onApply(job)}
          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all transform active:scale-95 group-hover:scale-105"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
