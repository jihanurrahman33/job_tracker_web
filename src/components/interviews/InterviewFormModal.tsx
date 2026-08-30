'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Interview, InterviewType, INTERVIEW_TYPE_LIST, Application } from '@/types/api';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { INTERVIEW_TYPE_CONFIG } from '@/lib/constants';
import { toInputDateTimeValue } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface InterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  interview?: Interview | null;
  onSuccess: (saved: Interview) => void;
}

export const InterviewFormModal: React.FC<InterviewFormModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  interview,
  onSuccess,
}) => {
  const isEditing = !!interview;
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>(applicationId || '');

  const [formData, setFormData] = useState({
    type: 'TECHNICAL' as InterviewType,
    scheduled_at: toInputDateTimeValue(new Date(Date.now() + 24 * 3600 * 1000).toISOString()),
    duration_minutes: '45',
    location: 'Zoom',
    meeting_url: '',
    notes: '',
  });

  useEffect(() => {
    setFormError(null);
    if (isOpen && !applicationId && !isEditing) {
      api
        .listApplications({ limit: 100 })
        .then((res) => {
          setApplications(res.data || []);
          if (res.data && res.data.length > 0 && !selectedAppId) {
            setSelectedAppId(res.data[0].id);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, applicationId, isEditing, selectedAppId]);

  useEffect(() => {
    setFormError(null);
    if (interview) {
      setFormData({
        type: interview.type || 'TECHNICAL',
        scheduled_at: toInputDateTimeValue(interview.scheduled_at),
        duration_minutes: interview.duration_minutes ? String(interview.duration_minutes) : '45',
        location: interview.location || '',
        meeting_url: interview.meeting_url || '',
        notes: interview.notes || '',
      });
      setSelectedAppId(interview.application_id || applicationId || '');
    } else {
      setFormData({
        type: 'TECHNICAL',
        scheduled_at: toInputDateTimeValue(new Date(Date.now() + 24 * 3600 * 1000).toISOString()),
        duration_minutes: '45',
        location: 'Zoom',
        meeting_url: '',
        notes: '',
      });
      if (applicationId) {
        setSelectedAppId(applicationId);
      }
    }
  }, [interview, applicationId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const targetAppId = applicationId || selectedAppId;

    if (!targetAppId && !isEditing) {
      const msg = 'Please select a job application for this interview.';
      setFormError(msg);
      error('Selection Required', msg);
      return;
    }

    if (!formData.scheduled_at) {
      const msg = 'Please select a date and time for the interview.';
      setFormError(msg);
      error('Validation Error', msg);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        type: formData.type,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes, 10) : undefined,
        location: formData.location.trim() || undefined,
        meeting_url: formData.meeting_url.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      let result: Interview;
      if (isEditing && interview) {
        result = await api.updateInterview(interview.id, payload);
        success('Interview Updated Successfully', `${result.type} round updated.`);
      } else {
        result = await api.createInterview(targetAppId, payload);
        success('Interview Scheduled Successfully', `${result.type} round scheduled.`);
      }

      onSuccess(result);
      onClose();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to process interview schedule.';
      setFormError(errMsg);
      error(isEditing ? 'Update Failed' : 'Schedule Failed', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Interview' : 'Schedule Interview Round'}
      subtitle={isEditing ? 'Update your interview schedule & notes' : 'Add an upcoming interview round to your pipeline'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* In-Form Error Alert Banner */}
        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-slide-up">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block">Action Failed:</strong>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {/* Application Selector (only if not pre-bound and not editing) */}
        {!applicationId && !isEditing && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Job Application <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.position}
                </option>
              ))}
              {applications.length === 0 && (
                <option value="" disabled>
                  No applications found. Create an application first.
                </option>
              )}
            </select>
          </div>
        )}

        {/* Interview Type & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Interview Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as InterviewType })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            >
              {INTERVIEW_TYPE_LIST.map((t) => (
                <option key={t} value={t}>
                  {INTERVIEW_TYPE_CONFIG[t]?.label || t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              step="5"
              placeholder="e.g. 45"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Date & Time <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={formData.scheduled_at}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        {/* Location & Meeting Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Platform / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Zoom, Google Meet, Onsite"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Meeting URL
            </label>
            <input
              type="url"
              placeholder="https://zoom.us/j/..."
              value={formData.meeting_url}
              onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Preparation Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Interview Preparation Notes
          </label>
          <textarea
            rows={3}
            placeholder="Focus areas, interviewer names, coding topics to review..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
          />
        </div>

        {/* Submit */}
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
            {isEditing ? 'Update Interview' : 'Schedule Interview'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
