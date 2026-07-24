import React from 'react';
import { Menu, Briefcase, User, LogOut, ShieldCheck, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenAdmin: () => void;
  onOpenDeployGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenAdmin,
  onOpenDeployGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/40 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left section: Mobile menu button & Brand */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors md:hidden focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a href="#" className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent whitespace-nowrap">
                  Today Job KSA
                </span>
                <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-amber-500/30">
                  KSA
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/90 font-arabic tracking-wide hidden sm:block">
                وظائف اليوم في السعودية
              </p>
            </div>
          </a>
        </div>

        {/* Right Section: Deploy Guide, Admin Shortcut, Seeker Auth */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
          {/* Vercel & Supabase Deploy Guide - Hidden on Mobile */}
          <button
            onClick={onOpenDeployGuide}
            className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="View Vercel & Supabase Deployment Instructions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Deploy Guide</span>
          </button>

          {/* Admin shortcut - Hidden on Mobile, accessible via side drawer */}
          <button
            onClick={onOpenAdmin}
            className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-medium border border-emerald-700/50 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </button>

          {/* Seeker Auth Status */}
          {currentUser ? (
            <div className="flex items-center space-x-2 rtl:space-x-reverse pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[100px] truncate">
                  {currentUser.fullName || currentUser.email}
                </span>
              </div>

              <button
                onClick={onSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
