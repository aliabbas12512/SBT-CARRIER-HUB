import React from 'react';
import { Search, Filter, MapPin, X, RotateCcw } from 'lucide-react';
import { FilterState, JobCategory, JobLocation } from '../types';

interface JobFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResultsCount: number;
}

export const CATEGORIES: JobCategory[] = [
  'Construction',
  'Driving',
  'Hospitality',
  'Retail',
  'Healthcare',
  'IT',
  'Security',
  'Cleaning',
  'Delivery',
  'Admin/Office',
  'Other',
];

export const LOCATIONS: JobLocation[] = [
  'Riyadh',
  'Jeddah',
  'Dammam',
  'Mecca',
  'Medina',
  'Khobar',
  'Taif',
  'Abha',
  'Jubail',
  'Yanbu',
  'Other',
];

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  totalResultsCount,
}) => {
  const isFiltered = filters.searchQuery || filters.category || filters.location;

  const handleClear = () => {
    onFilterChange({
      searchQuery: '',
      category: '',
      location: '',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Search Bar Top */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-emerald-400" />
        </div>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by job title, skill, or keyword..."
          className="w-full pl-11 pr-10 py-3.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {/* Category Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full pl-3.5 pr-8 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-200 text-sm appearance-none focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Categories ({CATEGORIES.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            City / Location
          </label>
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              className="w-full pl-3.5 pr-8 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-200 text-sm appearance-none focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Locations ({LOCATIONS.length})</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80 pointer-events-none" />
          </div>
        </div>

        {/* Results count & Clear button */}
        <div className="sm:col-span-2 lg:col-span-1 flex items-end justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
          <div className="text-xs text-slate-400 flex items-center">
            Found <span className="font-bold text-emerald-400 mx-1">{totalResultsCount}</span> jobs
          </div>

          {isFiltered && (
            <button
              onClick={handleClear}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills horizontal scroll */}
      <div className="pt-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar flex items-center space-x-2 rtl:space-x-reverse pb-1">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider">
          Quick:
        </span>
        <button
          onClick={() => onFilterChange({ ...filters, category: '' })}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            !filters.category
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All
        </button>
        {CATEGORIES.slice(0, 8).map((cat) => (
          <button
            key={cat}
            onClick={() =>
              onFilterChange({
                ...filters,
                category: filters.category === cat ? '' : cat,
              })
            }
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filters.category === cat
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
