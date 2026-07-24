import React from 'react';
import { Home, Briefcase, User, ShieldCheck, HelpCircle, X, MapPin, Building2, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'home' | 'jobs' | 'admin';
  onNavigate: (page: 'home' | 'jobs' | 'admin') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDeployGuide: () => void;
  totalJobsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenDeployGuide,
  totalJobsCount,
}) => {
  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      labelArabic: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'jobs' as const,
      label: 'View All Jobs',
      labelArabic: 'جميع الوظائف',
      icon: Briefcase,
      badge: totalJobsCount > 0 ? totalJobsCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header (Mobile close button) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-amber-300 text-sm">
              KSA
            </div>
            <div>
              <span className="font-bold text-sm text-white">Today Job KSA</span>
              <p className="text-[10px] text-emerald-400">Saudi Arabia Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Account Section */}
          <div className="pt-4 pb-2 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            User Account
          </div>

          <button
            onClick={() => {
              onOpenAuth();
              onClose();
            }}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>{currentUser ? 'My Profile' : 'Sign In / Sign Up'}</span>
          </button>

          {/* Admin Link */}
          <div className="pt-4 pb-2 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Administration
          </div>

          <button
            onClick={() => {
              onNavigate('admin');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
            }`}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
              Admin
            </span>
          </button>

          <button
            onClick={() => {
              onOpenDeployGuide();
              onClose();
            }}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Setup & Deploy SQL</span>
          </button>
        </div>

        {/* Sidebar Footer Info Card */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Saudi Arabia Coverage</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Riyadh, Jeddah, Dammam, Mecca, Medina & all 13 provinces.
            </p>
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-amber-400/90 font-medium">
              <span>Direct WhatsApp Apply</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
