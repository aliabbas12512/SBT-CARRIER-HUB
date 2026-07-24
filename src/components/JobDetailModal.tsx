import React, { useState } from 'react';
import { X, MapPin, Briefcase, Calendar, DollarSign, Phone, Mail, MessageSquare, Share2, CheckCircle2, Building2, Copy, Check } from 'lucide-react';
import { Job } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  // Format WhatsApp Link
  const getWhatsAppLink = () => {
    let num = job.whatsapp_number.replace(/[^0-9]/g, '');
    if (!num) num = '966500000000';
    // Ensure international format (e.g., 966...)
    if (num.startsWith('05')) {
      num = '966' + num.substring(1);
    }
    const message = encodeURIComponent(`Hi, I'm interested in applying for the "${job.title}" position listed on Today Job KSA.`);
    return `https://wa.me/${num}?text=${message}`;
  };

  // Format Email Link
  const getEmailLink = () => {
    const subject = encodeURIComponent(`Application for ${job.title}`);
    const body = encodeURIComponent(
      `Dear Hiring Manager,\n\nI am writing to express my strong interest in applying for the position of "${job.title}" located in ${job.location}.\n\nPlease find my resume attached.\n\nBest regards.`
    );
    return `mailto:${job.email || 'info@todayjobksa.com'}?subject=${subject}&body=${body}`;
  };

  // Format Call Link
  const getCallLink = () => {
    const num = job.phone || job.whatsapp_number || '+966500000000';
    return `tel:${num.replace(/[^0-9+]/g, '')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close Job Details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              {job.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {job.location}
            </span>
            <span className="text-xs text-slate-400 ml-auto flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Posted {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight pr-8">
            {job.title}
          </h2>

          <div className="flex items-center space-x-2 text-sm text-emerald-400 font-medium">
            <Building2 className="w-4 h-4" />
            <span>{job.company_name || 'Verified KSA Employer'}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Salary Box if provided */}
          {job.salary && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Offered Salary</span>
              </div>
              <span className="text-sm font-bold text-amber-300">{job.salary}</span>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
              Job Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              {job.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
              Requirements & Qualifications
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              {job.requirements || 'Standard qualifications for this role apply.'}
            </p>
          </div>

          {/* Contact Details Overview */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Employer Contact Info:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                <span className="font-mono text-emerald-400">{job.whatsapp_number || 'Available below'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email:</span>
                <span className="font-mono text-slate-200 truncate block">{job.email || 'Available below'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Phone:</span>
                <span className="font-mono text-slate-200">{job.phone || 'Available below'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons Section */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-300 text-center uppercase tracking-wider">
            Apply Directly to Employer
          </p>

          {/* Three Prominent Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. WhatsApp Button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* 2. Email Button */}
            <a
              href={getEmailLink()}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-sm transition-all hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Send Email</span>
            </a>

            {/* 3. Call Button */}
            <a
              href={getCallLink()}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call Direct</span>
            </a>
          </div>

          {/* Share / Copy link */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Job Link Copied!' : 'Copy Job Link to Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
