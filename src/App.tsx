import React, { useState, useEffect } from 'react';
import { Job, FilterState, UserProfile } from './types';
import { fetchJobs, getCurrentUser, signOutSeeker } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { AllJobsPage } from './pages/AllJobsPage';
import { AdminPortal } from './components/AdminPortal';
import { JobDetailModal } from './components/JobDetailModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Router page state: 'home' | 'jobs' | 'admin'
  const [currentPage, setCurrentPage] = useState<'home' | 'jobs' | 'admin'>('home');

  // Search & Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    location: '',
  });

  // Selected job for detail modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Layout UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Current Seeker User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Initial load
  const loadData = async () => {
    setLoadingJobs(true);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check saved seeker user session
    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });

    // Check if initial URL points to /admin or #admin
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const handleSignOut = async () => {
    await signOutSeeker();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Body Container with Left Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* Permanent Desktop / Collapsible Mobile Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          totalJobsCount={jobs.length}
        />

        {/* Page Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0">
          {loadingJobs ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Loading Saudi Arabia jobs...</p>
            </div>
          ) : currentPage === 'home' ? (
            <HomePage
              jobs={jobs}
              filters={filters}
              onFilterChange={setFilters}
              onApplyJob={(job) => setSelectedJob(job)}
              onViewAllJobs={() => setCurrentPage('jobs')}
            />
          ) : currentPage === 'jobs' ? (
            <AllJobsPage
              jobs={jobs}
              filters={filters}
              onFilterChange={setFilters}
              onApplyJob={(job) => setSelectedJob(job)}
            />
          ) : (
            <AdminPortal jobs={jobs} onRefreshJobs={loadData} />
          )}
        </main>
      </div>

      {/* Modals */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Today Job KSA</span>
            <span>•</span>
            <span>وظائف اليوم في المملكة العربية السعودية</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="hover:text-slate-300 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('jobs')}
              className="hover:text-slate-300 transition-colors"
            >
              All Jobs
            </button>
          </div>

          <p>© {new Date().getFullYear()} Today Job KSA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
