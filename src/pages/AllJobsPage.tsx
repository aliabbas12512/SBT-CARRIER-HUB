import React, { useState } from 'react';
import { Briefcase, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Job, FilterState } from '../types';
import { JobCard } from '../components/JobCard';
import { JobFilters } from '../components/JobFilters';

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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filter jobs
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          Browsing {filteredJobs.length} active listings across Riyadh, Jeddah, Dammam & all regions.
        </p>
      </div>

      {/* Filters Top */}
      <JobFilters
        filters={filters}
        onFilterChange={(f) => {
          onFilterChange(f);
          setCurrentPage(1); // Reset to page 1 on filter change
        }}
        totalResultsCount={filteredJobs.length}
      />

      {/* Jobs Grid */}
      {paginatedJobs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <p className="text-lg font-bold text-slate-300">No job listings found.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any jobs matching your current search criteria. Try adjusting keywords or clearing category/city filters.
          </p>
          <button
            onClick={() => {
              onFilterChange({ searchQuery: '', category: '', location: '' });
              setCurrentPage(1);
            }}
            className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All Jobs</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={onApplyJob} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Showing <span className="font-bold text-emerald-400">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-emerald-400">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length)}
            </span>{' '}
            of <span className="font-bold text-slate-200">{filteredJobs.length}</span> jobs
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
