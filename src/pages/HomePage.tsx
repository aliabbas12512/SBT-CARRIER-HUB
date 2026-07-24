import React from 'react';
import { ArrowRight, Briefcase, MapPin, MessageSquare, Zap, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { Job, FilterState } from '../types';
import { JobCard } from '../components/JobCard';
import { JobFilters } from '../components/JobFilters';
import { AdNative } from '../components/AdNative';

interface HomePageProps {
  jobs: Job[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApplyJob: (job: Job) => void;
  onViewAllJobs: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  jobs,
  filters,
  onFilterChange,
  onApplyJob,
  onViewAllJobs,
}) => {
  // Filter jobs based on search & dropdowns
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !filters.searchQuery ||
      job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory = !filters.category || job.category === filters.category;
    const matchesLocation = !filters.location || job.location === filters.location;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Get top 6 latest jobs
  const latestJobs = filteredJobs.slice(0, 6);

  return (
    <div className="space-y-10 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/40 p-6 sm:p-10 shadow-2xl text-slate-100">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>#1 Direct Job Portal in Saudi Arabia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Apply to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Saudi Arabia Jobs</span> in Under 60 Seconds
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover verified daily job openings across Riyadh, Jeddah, Dammam, Mecca, Medina and all 13 provinces. Connect directly with hiring managers via WhatsApp, Email, or Phone.
          </p>

          {/* Quick stats badges */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free for Job Seekers</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Direct WhatsApp Contact</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Employers</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR & FILTERS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>Search & Filter Jobs</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Updated Daily</span>
        </div>

        <JobFilters
          filters={filters}
          onFilterChange={onFilterChange}
          totalResultsCount={filteredJobs.length}
        />

        {/* Adsterra Native Banner Slot: ad-slot-home-top */}
        <AdNative id="container-45f9ec742643229727e4e14a7092ea0f-top" />
      </section>

      {/* LATEST JOBS SECTION (SHOWING UP TO 6 CARDS) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Latest Job Postings</h2>
            <p className="text-xs text-slate-400">Freshly added job opportunities in Saudi Arabia</p>
          </div>

          <button
            onClick={onViewAllJobs}
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All ({filteredJobs.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {latestJobs.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <p className="text-base font-bold text-slate-300">No jobs match your search filters.</p>
            <p className="text-xs text-slate-500">Try clearing category or city filters to view all jobs.</p>
            <button
              onClick={() => onFilterChange({ searchQuery: '', category: '', location: '' })}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestJobs.map((job, index) => (
              <React.Fragment key={job.id}>
                <JobCard job={job} onApply={onApplyJob} />
                {(index + 1) % 5 === 0 && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 my-2">
                    <AdNative id={`container-45f9ec742643229727e4e14a7092ea0f-home-${index + 1}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* View All Jobs Centered Button */}
        <div className="pt-4 text-center">
          <button
            onClick={onViewAllJobs}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:opacity-95 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950/40 transition-all hover:scale-105"
          >
            <span>View All Jobs ({jobs.length} Total)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER INFO HIGHLIGHT */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">1-Click WhatsApp Apply</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Chat directly with HR and employers without tedious long forms.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">All KSA Major Cities</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, Taif, Abha & more.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Verified Employers</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Quality job postings updated daily for drivers, engineers, admins & retail.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
