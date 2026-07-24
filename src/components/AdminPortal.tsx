import React, { useState } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  FileSpreadsheet,
  Edit,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Lock,
  Mail,
  Building2,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Job, BulkUploadResult } from '../types';
import { CATEGORIES, LOCATIONS } from './JobFilters';
import { downloadExcelTemplate, parseExcelFile } from '../lib/excel';
import { createJob, updateJob, deleteJob, bulkCreateJobs } from '../lib/supabase';

interface AdminPortalProps {
  jobs: Job[];
  onRefreshJobs: () => void;
  onClose?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ jobs, onRefreshJobs, onClose }) => {
  // Admin Login Credentials
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'sbt.abbas123@gmail.com';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin View tab
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'bulk' | 'settings'>('manage');

  // Search in manage tab
  const [searchQuery, setSearchQuery] = useState('');

  // Single Job Form State (Add or Edit)
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Construction',
    location: 'Riyadh',
    company_name: 'Verified KSA Employer',
    description: '',
    requirements: '',
    salary: '',
    whatsapp_number: '',
    email: '',
    phone: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Bulk Upload State
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Delete Confirmation state
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginEmail.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() && loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Please use correct admin credentials.');
    }
  };

  // Reset Single Job Form
  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Construction',
      location: 'Riyadh',
      company_name: 'Verified KSA Employer',
      description: '',
      requirements: '',
      salary: '',
      whatsapp_number: '',
      email: '',
      phone: '',
    });
    setEditingJob(null);
    setFormFeedback(null);
  };

  // Open Edit Modal
  const handleStartEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      category: job.category,
      location: job.location,
      company_name: job.company_name || 'Verified KSA Employer',
      description: job.description,
      requirements: job.requirements,
      salary: job.salary || '',
      whatsapp_number: job.whatsapp_number,
      email: job.email,
      phone: job.phone,
    });
    setIsAddModalOpen(true);
  };

  // Submit Single Job (Create or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormFeedback(null);

    try {
      if (!formData.title || !formData.category || !formData.location) {
        throw new Error('Title, Category, and Location are required fields.');
      }

      if (editingJob) {
        await updateJob(editingJob.id, formData);
        setFormFeedback({ type: 'success', msg: 'Job updated successfully!' });
      } else {
        await createJob(formData);
        setFormFeedback({ type: 'success', msg: 'New job posted successfully!' });
      }

      onRefreshJobs();
      setTimeout(() => {
        setIsAddModalOpen(false);
        resetForm();
      }, 1000);
    } catch (err: any) {
      setFormFeedback({ type: 'error', msg: err?.message || 'Action failed. Please try again.' });
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      setDeletingJobId(null);
      onRefreshJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  // Handle Excel Bulk File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    setBulkError(null);
    setBulkResult(null);

    try {
      const { validJobs, result } = await parseExcelFile(file);

      if (validJobs.length > 0) {
        await bulkCreateJobs(validJobs);
        onRefreshJobs();
      }

      setBulkResult(result);
    } catch (err: any) {
      setBulkError(err?.message || 'Failed to process Excel file.');
    } finally {
      setBulkLoading(false);
      e.target.value = ''; // Reset input
    }
  };

  // Filter jobs for management table
  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- UNAUTHENTICATED LOGIN SCREEN ---------------- */
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 mx-auto mb-3 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Admin Portal Login</h2>
          <p className="text-xs text-slate-400 mt-1">Authorized access for Today Job KSA admins</p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="sbt.abbas123@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-600 to-emerald-500 hover:opacity-95 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all"
          >
            Sign In to Admin Dashboard
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-amber-400 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1" />
            Default Credentials:
          </p>
          <p>Email: <span className="text-slate-200 font-mono">sbt.abbas123@gmail.com</span></p>
          <p>Password: <span className="text-slate-200 font-mono">admin123</span></p>
        </div>
      </div>
    );
  }

  /* ---------------- AUTHENTICATED ADMIN DASHBOARD ---------------- */
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Admin Management Dashboard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage live jobs, add new postings, bulk upload via Excel, and update configuration.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              resetForm();
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Single Job</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('manage')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'manage'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>All Live Jobs ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'bulk'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Bulk Excel Upload (.xlsx)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Change Admin Password Info</span>
        </button>
      </div>

      {/* TAB 1: MANAGE ALL JOBS TABLE */}
      {activeTab === 'manage' && (
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title, category..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
              />
            </div>

            <button
              onClick={onRefreshJobs}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/50">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title & Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">WhatsApp / Contact</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No jobs found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block text-sm">{job.title}</span>
                        <span className="text-[11px] text-emerald-400">
                          {job.company_name || 'Verified KSA Employer'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {job.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-300">{job.location}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>WA: {job.whatsapp_number || 'N/A'}</div>
                        <div className="text-slate-400">{job.email || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(job)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900 text-emerald-400 hover:text-white transition-colors"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingJobId(job.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BULK EXCEL UPLOAD */}
      {activeTab === 'bulk' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Download Template */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Download className="w-5 h-5" />
                <span>Step 1: Download Excel (.xlsx) Template</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download the official Excel template pre-formatted with all required columns:
                <br />
                <code className="text-emerald-400 font-mono text-[11px] block mt-1">
                  Title, Category, Location, Description, Requirements, Salary, WhatsAppNumber, Email, Phone
                </code>
              </p>
              <button
                onClick={downloadExcelTemplate}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download .xlsx Template File</span>
              </button>
            </div>

            {/* Step 2: Upload File */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Upload className="w-5 h-5" />
                <span>Step 2: Upload Completed Excel File</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your populated .xlsx spreadsheet. The parser will automatically validate each row and insert valid job listings into the database without crashing.
              </p>

              <label className="border-2 border-dashed border-emerald-600/50 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-emerald-950/10 hover:bg-emerald-950/20 transition-all">
                <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="text-xs font-bold text-slate-200">
                  {bulkLoading ? 'Processing file...' : 'Click to browse .xlsx file'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">Supports Microsoft Excel (.xlsx)</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  disabled={bulkLoading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Results & Feedback */}
          {bulkError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}

          {bulkResult && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Bulk Upload Summary</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Added Successfully</span>
                  <span className="text-lg font-bold text-emerald-400">{bulkResult.successCount} jobs</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Skipped (Invalid)</span>
                  <span className="text-lg font-bold text-amber-400">{bulkResult.skippedCount} rows</span>
                </div>
              </div>

              {bulkResult.errors.length > 0 && (
                <div className="mt-3 p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-xs space-y-1">
                  <p className="font-semibold text-rose-300">Skipped Rows Report:</p>
                  <ul className="list-disc pl-5 text-rose-200 space-y-0.5 max-h-32 overflow-y-auto">
                    {bulkResult.errors.map((err, idx) => (
                      <li key={idx}>
                        Row {err.rowNumber}: {err.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADMIN SETTINGS & PASSWORD CHANGE INFO */}
      {activeTab === 'settings' && (
        <div className="p-6 space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Info className="w-5 h-5 text-amber-400" />
            <span>How to Change Admin Password & Security Configuration</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              To maintain basic security and avoid hardcoding credentials in public code repositories, admin credentials are handled via environment variables:
            </p>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-emerald-400 space-y-1 text-[11px]">
              <div>VITE_ADMIN_EMAIL="sbt.abbas123@gmail.com"</div>
              <div>VITE_ADMIN_PASSWORD="YourSecurePasswordHere"</div>
            </div>

            <p className="font-semibold text-slate-200">Steps to update password on Vercel deployment:</p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
              <li>Go to your project dashboard on Vercel.com</li>
              <li>Navigate to <strong className="text-white">Settings</strong> → <strong className="text-white">Environment Variables</strong></li>
              <li>Add or edit <code className="text-amber-300">VITE_ADMIN_PASSWORD</code> with your custom new password</li>
              <li>Redeploy the project to apply changes instantly</li>
            </ol>
          </div>
        </div>
      )}

      {/* ADD / EDIT SINGLE JOB MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 my-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingJob ? 'Edit Job Posting' : 'Post a New Single Job'}
            </h3>

            {formFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{formFeedback.msg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Job Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Heavy Driver / Project Manager"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company / Employer Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. Red Sea Global / Al-Marai"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Salary Range (Optional)</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. 4,000 - 5,500 SAR"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe key responsibilities and work hours..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Requirements</label>
                <textarea
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g. Valid Saudi driver license, 2+ years experience..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="966500000000"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hr@company.sa"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Call Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966500000000"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  {formLoading ? 'Saving...' : editingJob ? 'Update Job' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 text-center">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Delete Job Posting?</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              This action cannot be undone. Are you sure you want to permanently remove this listing?
            </p>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deletingJobId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
