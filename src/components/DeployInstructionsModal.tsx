import React, { useState } from 'react';
import { X, Copy, Check, Database, Terminal, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DeployInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SUPABASE POSTGRES SQL SCHEMA FOR "Today Job KSA"
-- Copy & Run this in Supabase SQL Editor
-- ==========================================

-- 1. Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  salary TEXT,
  whatsapp_number TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT DEFAULT 'Verified KSA Employer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can view jobs
CREATE POLICY "Public Read Access"
  ON public.jobs FOR SELECT
  USING (true);

-- 4. Policy: Anyone can insert/update/delete (or restrict to auth users)
CREATE POLICY "Public Write Access for Admin"
  ON public.jobs FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Create index for fast searching
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);
`;

export const DeployInstructionsModal: React.FC<DeployInstructionsModalProps> = ({ isOpen, onClose }) => {
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-6 sm:p-8 my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Production Deployment & Supabase Setup</h3>
            <p className="text-xs text-slate-400">Step-by-step guide to launch "Today Job KSA" on Vercel</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs text-slate-300 leading-relaxed">
          {/* STEP 1: SUPABASE SQL SCHEMA */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-sm flex items-center">
                <Database className="w-4 h-4 mr-1.5" />
                Step 1: Supabase Database Schema (SQL)
              </span>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <p className="text-slate-400">
              In your Supabase dashboard, go to <strong>SQL Editor</strong> → click <strong>New Query</strong>, paste this code and click <strong>Run</strong>:
            </p>

            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-200 overflow-x-auto max-h-48 overflow-y-auto">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          {/* STEP 2: ENVIRONMENT VARIABLES */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 text-sm flex items-center">
              <Terminal className="w-4 h-4 mr-1.5" />
              Step 2: Vercel Environment Variables (.env)
            </span>
            <p className="text-slate-400">
              Add these environment variables under <strong>Project Settings → Environment Variables</strong> in Vercel:
            </p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-emerald-300 space-y-1 text-[11px]">
              <div>VITE_SUPABASE_URL="https://your-project.supabase.co"</div>
              <div>VITE_SUPABASE_ANON_KEY="your-anon-key"</div>
              <div>VITE_ADMIN_EMAIL="sbt.abbas123@gmail.com"</div>
              <div>VITE_ADMIN_PASSWORD="admin123"</div>
            </div>
          </div>

          {/* STEP 3: DEPLOYMENT STEPS */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 text-sm flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Step 3: GitHub Push & Vercel Import
            </span>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
              <li>Push this codebase to a new GitHub repository (<code className="text-amber-300 font-mono">git push origin main</code>).</li>
              <li>Log in to <strong className="text-white">Vercel.com</strong> → click <strong className="text-white">Add New Project</strong>.</li>
              <li>Import your GitHub repository and select framework <strong className="text-emerald-400">Vite</strong>.</li>
              <li>Paste the environment variables above and click <strong className="text-emerald-400">Deploy</strong>.</li>
              <li>Your site will be live on Vercel with zero build errors!</li>
            </ol>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
