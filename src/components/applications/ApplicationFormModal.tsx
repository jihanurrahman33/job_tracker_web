'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LIST,
} from '@/types/api';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { STATUS_CONFIG } from '@/lib/constants';
import { toInputDateValue } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: Application | null;
  defaultStatus?: ApplicationStatus;
  onSuccess: (savedApp: Application) => void;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  application,
  defaultStatus = 'APPLIED',
  onSuccess,
}) => {
  const isEditing = !!application;
  const { success, error, showAlert } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    job_url: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'BDT',
    status: defaultStatus,
    applied_at: toInputDateValue(new Date().toISOString()),
    notes: '',
  });

  useEffect(() => {
    setFormError(null);
    if (application) {
      setFormData({
        company: application.company || '',
        position: application.position || '',
        location: application.location || '',
        job_url: application.job_url || '',
        salary_min: application.salary_min
          ? String(application.salary_min)
          : '',
        salary_max: application.salary_max
          ? String(application.salary_max)
          : '',
        salary_currency: application.salary_currency || 'BDT',
        status: application.status || 'APPLIED',
        applied_at: toInputDateValue(application.applied_at),
        notes: application.notes || '',
      });
    } else {
      setFormData({
        company: '',
        position: '',
        location: '',
        job_url: '',
        salary_min: '',
        salary_max: '',
        salary_currency: 'BDT',
        status: defaultStatus,
        applied_at: toInputDateValue(new Date().toISOString()),
        notes: '',
      });
    }
  }, [application, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.company.trim() || !formData.position.trim()) {
      const msg = 'Company Name and Position are required fields.';
      setFormError(msg);
      error('Validation Error', msg);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        company: formData.company.trim(),
        position: formData.position.trim(),
        location: formData.location.trim() || undefined,
        job_url: formData.job_url.trim() || undefined,
        salary_min: formData.salary_min
          ? Number(formData.salary_min)
          : undefined,
        salary_max: formData.salary_max
          ? Number(formData.salary_max)
          : undefined,
        salary_currency: formData.salary_currency || 'BDT',
        status: formData.status,
        applied_at: formData.applied_at
          ? new Date(formData.applied_at).toISOString()
          : undefined,
        notes: formData.notes.trim() || undefined,
      };

      let result: Application;
      if (isEditing && application) {
        result = await api.updateApplication(application.id, payload);
        success(
          'Application Updated Successfully',
          `${result.position} at ${result.company}`
        );
      } else {
        result = await api.createApplication(payload);
        success(
          'Application Created Successfully',
          `Added ${result.position} at ${result.company} to your pipeline.`
        );
      }

      onSuccess(result);
      onClose();
    } catch (err: any) {
      let errMsg = err.message || 'An unexpected error occurred.';
      if (err.details) {
        errMsg = Object.entries(err.details)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      }
      setFormError(errMsg);
      error(
        isEditing ? 'Update Failed' : 'Creation Failed',
        errMsg
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Application' : 'Track New Job Application'}
      subtitle={
        isEditing
          ? 'Update your job application details'
          : 'Enter the details of the job opportunity'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* In-Form Error Alert Banner */}
        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-slide-up">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block">Submission Failed:</strong>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {/* Company & Position */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe, Google, Acme Corp"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Position / Role <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Backend Engineer"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Status & Applied Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ApplicationStatus,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            >
              {APPLICATION_STATUS_LIST.map((st) => (
                <option key={st} value={st}>
                  {STATUS_CONFIG[st]?.label || st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Date Applied
            </label>
            <input
              type="date"
              value={formData.applied_at}
              onChange={(e) =>
                setFormData({ ...formData, applied_at: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Location & Job Posting URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Remote, Dhaka, San Francisco"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Job Posting URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.job_url}
              onChange={(e) =>
                setFormData({ ...formData, job_url: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Salary Range & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Min Salary
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={formData.salary_min}
              onChange={(e) =>
                setFormData({ ...formData, salary_min: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Max Salary
            </label>
            <input
              type="number"
              placeholder="e.g. 80000"
              value={formData.salary_max}
              onChange={(e) =>
                setFormData({ ...formData, salary_max: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Currency
            </label>
            <select
              value={formData.salary_currency}
              onChange={(e) =>
                setFormData({ ...formData, salary_currency: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Notes / Referral Details
          </label>
          <textarea
            rows={3}
            placeholder="Recruiter name, referral info, portfolio link, interview preparation tips..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isEditing ? 'Save Changes' : 'Create Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
