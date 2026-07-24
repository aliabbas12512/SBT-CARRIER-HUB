import { createClient } from '@supabase/supabase-js';
import { Job, UserProfile } from '../types';
import { INITIAL_JOBS } from './initialJobs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.length > 5 &&
    !supabaseUrl.includes('your-supabase-project') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10 &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY_JOBS = 'today_job_ksa_jobs_v1';
const STORAGE_KEY_USER = 'today_job_ksa_user_v1';

// Initialize Local Storage cache if empty
function getLocalJobs(): Job[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_JOBS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_JOBS;
  }
}

function setLocalJobs(jobs: Job[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Fetch all jobs sorted by newest first
 */
export async function fetchJobs(): Promise<Job[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase query error, falling back to local cache:', error.message);
        return getLocalJobs();
      }

      if (data && data.length > 0) {
        return data as Job[];
      } else {
        // Seed initial jobs if table is empty
        return getLocalJobs();
      }
    } catch (err) {
      console.warn('Error connecting to Supabase, fallback to local state:', err);
      return getLocalJobs();
    }
  }

  return getLocalJobs();
}

/**
 * Add a single job
 */
export async function createJob(jobData: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
  const newJob: Job = {
    ...jobData,
    id: 'job-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: jobData.title,
          category: jobData.category,
          location: jobData.location,
          description: jobData.description,
          requirements: jobData.requirements,
          salary: jobData.salary || null,
          whatsapp_number: jobData.whatsapp_number,
          email: jobData.email,
          phone: jobData.phone,
          company_name: jobData.company_name || 'Hiring Company'
        }])
        .select()
        .single();

      if (!error && data) {
        // update local cache as well
        const current = getLocalJobs();
        setLocalJobs([data as Job, ...current]);
        return data as Job;
      }
    } catch (err) {
      console.warn('Supabase create error, inserting into local cache:', err);
    }
  }

  const current = getLocalJobs();
  const updated = [newJob, ...current];
  setLocalJobs(updated);
  return newJob;
}

/**
 * Update an existing job
 */
export async function updateJob(id: string, jobData: Partial<Job>): Promise<Job | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const current = getLocalJobs();
        const updated = current.map((j) => (j.id === id ? { ...j, ...data } : j));
        setLocalJobs(updated);
        return data as Job;
      }
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }

  const current = getLocalJobs();
  let updatedJob: Job | null = null;
  const updated = current.map((j) => {
    if (j.id === id) {
      updatedJob = { ...j, ...jobData };
      return updatedJob;
    }
    return j;
  });
  setLocalJobs(updated);
  return updatedJob;
}

/**
 * Delete a job
 */
export async function deleteJob(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }

  const current = getLocalJobs();
  const filtered = current.filter((j) => j.id !== id);
  setLocalJobs(filtered);
  return true;
}

/**
 * Bulk insert multiple jobs from Excel upload
 */
export async function bulkCreateJobs(jobsList: Array<Omit<Job, 'id' | 'created_at'>>): Promise<number> {
  if (jobsList.length === 0) return 0;

  const now = new Date().toISOString();
  const formattedJobs = jobsList.map((j, idx) => ({
    title: j.title,
    category: j.category || 'Other',
    location: j.location || 'Other',
    description: j.description || '',
    requirements: j.requirements || '',
    salary: j.salary || '',
    whatsapp_number: j.whatsapp_number || '',
    email: j.email || '',
    phone: j.phone || '',
    company_name: j.company_name || 'Hiring Company',
  }));

  if (supabase) {
    try {
      const { data, error } = await supabase.from('jobs').insert(formattedJobs).select();
      if (!error && data) {
        const current = getLocalJobs();
        setLocalJobs([...(data as Job[]), ...current]);
        return data.length;
      }
    } catch (err) {
      console.warn('Supabase bulk insert failed, using local storage fallback:', err);
    }
  }

  const current = getLocalJobs();
  const newItems: Job[] = formattedJobs.map((j, idx) => ({
    ...j,
    id: `job-bulk-${Date.now()}-${idx}`,
    created_at: new Date(Date.now() - idx * 1000).toISOString(),
  }));

  setLocalJobs([...newItems, ...current]);
  return newItems.length;
}

// ---------------- AUTH HELPER FUNCTIONS ----------------

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          phone: session.user.user_metadata?.phone || '',
        };
      }
    } catch (err) {
      console.warn('Supabase getSession error:', err);
    }
  }

  try {
    const local = localStorage.getItem(STORAGE_KEY_USER);
    if (local) return JSON.parse(local);
  } catch {}
  return null;
}

export async function signUpSeeker(email: string, pass: string, fullName: string, phone: string) {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email,
        fullName,
        phone,
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      return profile;
    }
  }

  // Local fallback auth simulation
  const profile: UserProfile = {
    id: 'user-' + Date.now(),
    email,
    fullName,
    phone,
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  return profile;
}

export async function signInSeeker(email: string, pass: string) {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        phone: data.user.user_metadata?.phone || '',
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      return profile;
    }
  }

  // Local fallback auth
  const profile: UserProfile = {
    id: 'user-demo',
    email,
    fullName: email.split('@')[0],
    phone: '+966500000000',
  };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  return profile;
}

export async function signOutSeeker() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(STORAGE_KEY_USER);
}
