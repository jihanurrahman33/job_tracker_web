'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Reminder, Application } from '@/types/api';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { toInputDateTimeValue } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  reminder?: Reminder | null;
  onSuccess: (saved: Reminder) => void;
}

export const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  reminder,
  onSuccess,
}) => {
  const isEditing = !!reminder;
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>(applicationId || '');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    remind_at: toInputDateTimeValue(new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString()),
    completed: false,
  });

  useEffect(() => {
    setFormError(null);
    if (isOpen && !applicationId && !isEditing) {
      api
        .listApplications({ limit: 100 })
        .then((res) => {
          setApplications(res.data || []);
        })
        .catch(console.error);
    }
  }, [isOpen, applicationId, isEditing]);

  useEffect(() => {
    setFormError(null);
    if (reminder) {
      setFormData({
        title: reminder.title || '',
        description: reminder.description || '',
        remind_at: toInputDateTimeValue(reminder.remind_at),
        completed: reminder.completed,
      });
      setSelectedAppId(reminder.application_id || applicationId || '');
    } else {
      setFormData({
        title: '',
        description: '',
        remind_at: toInputDateTimeValue(new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString()),
        completed: false,
      });
      if (applicationId) {
        setSelectedAppId(applicationId);
      }
    }
  }, [reminder, applicationId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      const msg = 'Please enter a title for the reminder.';
      setFormError(msg);
      error('Validation Error', msg);
      return;
    }

    if (!formData.remind_at) {
      const msg = 'Please pick a date and time for the reminder.';
      setFormError(msg);
      error('Validation Error', msg);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        remind_at: new Date(formData.remind_at).toISOString(),
      };

      if (isEditing && reminder) {
        payload.completed = formData.completed;
        const result = await api.updateReminder(reminder.id, payload);
        success('Reminder Updated Successfully', result.title);
        onSuccess(result);
      } else {
        if (selectedAppId) {
          payload.application_id = selectedAppId;
        }
        const result = await api.createReminder(payload);
        success('Reminder Created Successfully', result.title);
        onSuccess(result);
      }

      onClose();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to process reminder.';
      setFormError(errMsg);
      error(isEditing ? 'Update Failed' : 'Creation Failed', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Reminder' : 'Set Follow-up Reminder'}
      subtitle={isEditing ? 'Update task details or status' : 'Keep track of follow-ups, recruiter replies, and task deadlines'}
      maxWidth="md"
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

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Reminder Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Follow up on tech screen feedback"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Remind At (Date & Time) <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={formData.remind_at}
            onChange={(e) => setFormData({ ...formData, remind_at: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        {/* Optional Linked Application */}
        {!applicationId && !isEditing && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Link to Job Application (Optional)
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            >
              <option value="">-- None (General Reminder) --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.position}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Additional Notes / Instructions
          </label>
          <textarea
            rows={3}
            placeholder="Key talking points, questions to ask, email templates..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
          />
        </div>

        {/* Completed checkbox if editing */}
        {isEditing && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-zinc-700 focus:ring-indigo-500"
            />
            <label
              htmlFor="completed"
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              Mark as Completed
            </label>
          </div>
        )}

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
            {isEditing ? 'Update Reminder' : 'Set Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
