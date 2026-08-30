import { ApplicationStatus, InterviewType } from '@/types/api';

export const SERVER_PRESETS = [
  {
    name: 'Render Cloud (Default)',
    url: 'https://job-tracker-server-9drb.onrender.com',
    description: 'Render Hosted Live API Instance',
  },
  {
    name: 'Vercel Serverless',
    url: 'https://job-tracker-server-nu.vercel.app',
    description: 'Vercel Edge/Serverless Deployment',
  },
  {
    name: 'Local Server (Docker / Go)',
    url: 'http://localhost:8080',
    description: 'Local Go Daemon at port 8080',
  },
];

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string; dot: string; darkBg: string }
> = {
  APPLIED: {
    label: 'Applied',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    darkBg: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  SCREENING: {
    label: 'Screening',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    darkBg: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  INTERVIEW: {
    label: 'Interview',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    darkBg: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
  TECHNICAL_INTERVIEW: {
    label: 'Tech Interview',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    darkBg: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-800',
    dot: 'bg-indigo-500',
  },
  OFFER: {
    label: 'Offer Received',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    darkBg: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: 'bg-teal-50 text-teal-700 border-teal-200',
    darkBg: 'dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-300 dark:border-teal-800',
    dot: 'bg-teal-500',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    darkBg: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    darkBg: 'dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    text: 'text-slate-700 dark:text-zinc-300',
    border: 'border-slate-300 dark:border-zinc-700',
    dot: 'bg-slate-400',
  },
};

export const INTERVIEW_TYPE_CONFIG: Record<
  InterviewType,
  { label: string; bg: string; text: string; border: string; darkBg: string }
> = {
  PHONE_SCREEN: {
    label: 'Phone Screen',
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    darkBg: 'dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-300 dark:border-cyan-800',
  },
  HR: {
    label: 'HR / Recruiter',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    darkBg: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
  },
  TECHNICAL: {
    label: 'Technical Coding',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    darkBg: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-800',
  },
  BEHAVIORAL: {
    label: 'Behavioral & Fit',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    darkBg: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
  },
  SYSTEM_DESIGN: {
    label: 'System Design',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    darkBg: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-800',
  },
  FINAL: {
    label: 'Final Round',
    bg: 'bg-pink-50 text-pink-700 border-pink-200',
    darkBg: 'dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-300 dark:border-pink-800',
  },
  OTHER: {
    label: 'Other',
    bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    darkBg: 'dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    text: 'text-zinc-700 dark:text-zinc-300',
    border: 'border-zinc-300 dark:border-zinc-700',
  },
};

