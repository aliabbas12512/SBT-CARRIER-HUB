import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { Job, FilterState } from '../types';
import { JobCard } from '../components/JobCard';
import { JobFilters } from '../components/JobFilters';
import { AdNative } from '../components/AdNative';

interface AllJobsPageProps {
  jobs: Job[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApplyJob: (job: Job) => void;
}

export const AllJobsPage: React.FC<AllJobsPageProps> = ({
  jobs,
  filters,
  onFilterChange,
  onApplyJob,
}) => {
  const BATCH_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Filter jobs based on active search criteria
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

  // Reset visibleCount back to initial BATCH_SIZE when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filters.searchQuery, filters.category, filters.location]);

  // Currently loaded visible slice of jobs
  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredJobs.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, filteredJobs.length]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
          <Briefcase className="w-4 h-4" />
          <span>Complete Job Board</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          All Available Jobs in Saudi Arabia
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Showing {visibleJobs.length} of {filteredJobs.length} active listings across Riyadh, Jeddah, Dammam & all regions.
        </p>
      </div>

      {/* Filters Top */}
      <JobFilters
        filters={filters}
        onFilterChange={(f) => {
          onFilterChange(f);
          setVisibleCount(BATCH_SIZE);
        }}
        totalResultsCount={filteredJobs.length}
      />

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <p className="text-lg font-bold text-slate-300">No job listings found.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any jobs matching your current search criteria. Try adjusting keywords or clearing category/city filters.
          </p>
          <button
            onClick={() => {
              onFilterChange({ searchQuery: '', category: '', location: '' });
              setVisibleCount(BATCH_SIZE);
            }}
            className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All Jobs</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleJobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <JobCard job={job} onApply={onApplyJob} />
              {(index + 1) % 5 === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 my-2">
                  <AdNative id={`container-45f9ec742643229727e4e14a7092ea0f-infinite-${index + 1}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel & Loader / Completion Indicator */}
      {filteredJobs.length > 0 && (
        <div className="pt-6 border-t border-slate-800/80 flex flex-col items-center justify-center">
          {hasMore ? (
            <div ref={observerTargetRef} className="py-6 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Loading more jobs ({visibleJobs.length} / {filteredJobs.length})...</p>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="inline-flex items-center space-x-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl shadow-inner">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  You've reached the end — <strong className="text-emerald-400">{filteredJobs.length}</strong> of <strong className="text-emerald-400">{filteredJobs.length}</strong> jobs shown
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
