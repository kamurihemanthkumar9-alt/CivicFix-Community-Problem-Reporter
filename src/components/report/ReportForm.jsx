import React, { useState } from 'react';
import { CATEGORIES, URGENCY_OPTIONS } from '../../data/sampleReports';
import { ImageUploader } from './ImageUploader';
import { LocationPicker } from './LocationPicker';
import { DuplicateModal } from './DuplicateModal';
import { detectDuplicateReports } from '../../services/duplicateDetector';
import { calculatePriorityScore } from '../../services/priorityScorer';
import { PriorityBadge } from '../common/PriorityBadge';
import { useToast } from '../common/Toast';
import {
  Send,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function ReportForm({ existingReports = [], onSubmitReport, onViewReport, onUpvoteReport, onClose }) {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('roads');
  const [urgency, setUrgency] = useState('Medium');
  const [photoUrl, setPhotoUrl] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('37.7833');
  const [longitude, setLongitude] = useState('-122.4089');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateMatches, setDuplicateMatches] = useState([]);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Live priority score estimation
  const liveScore = calculatePriorityScore({
    urgency,
    title,
    description,
    locationName,
    upvotes: 0
  });

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Please enter a clear issue title.';
    else if (title.trim().length < 5) errs.title = 'Title must be at least 5 characters.';

    if (!description.trim()) errs.description = 'Please provide details describing the problem.';
    else if (description.trim().length < 15) errs.description = 'Please provide at least 15 characters describing the issue.';

    if (!locationName.trim()) errs.locationName = 'Please specify the street address or location name.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    const reportData = {
      title,
      description,
      category,
      urgency,
      photo_url: photoUrl,
      location_name: locationName,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    };

    // Check duplicates before saving
    const dupCheck = detectDuplicateReports({
      newReport: reportData,
      existingReports,
      distanceThresholdMeters: 350
    });

    if (dupCheck.hasDuplicates) {
      setDuplicateMatches(dupCheck.matches);
      setIsDuplicateModalOpen(true);
      return;
    }

    // Direct submit if no duplicate
    performSave(reportData);
  };

  const performSave = async (dataToSave) => {
    setIsSubmitting(true);
    try {
      const created = await onSubmitReport(dataToSave);
      addToast(`Complaint submitted successfully! Tracking ID: ${created.complaint_id}`, 'success', 6000);
      if (onClose) onClose();
    } catch (err) {
      addToast(err.message || 'Failed to submit complaint. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedDuplicate = () => {
    setIsDuplicateModalOpen(false);
    const reportData = {
      title,
      description,
      category,
      urgency,
      photo_url: photoUrl,
      location_name: locationName,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    };
    performSave(reportData);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Issue Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Issue Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            placeholder="e.g. Hazardous deep pothole causing vehicle damage"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
              errors.title ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-blue-600'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Description *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
            placeholder="Describe the problem, dimensions, severity, safety impact, or how long it has persisted..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
              errors.description ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-blue-600'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Urgency Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Urgency Level *</span>
            <span className="text-[11px] font-normal text-slate-400">Determines initial municipal dispatch priority</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {URGENCY_OPTIONS.map((urg) => {
              const isSelected = urgency === urg.id;
              return (
                <button
                  key={urg.id}
                  type="button"
                  onClick={() => setUrgency(urg.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? urg.id === 'High'
                        ? 'border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-400/20'
                        : urg.id === 'Medium'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-400/20'
                        : 'border-slate-600 bg-slate-50 text-slate-900 ring-2 ring-slate-400/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs">{urg.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{urg.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Upload & Preview */}
        <ImageUploader
          photoUrl={photoUrl}
          setPhotoUrl={setPhotoUrl}
          selectedCategory={category}
        />

        {/* Location Picker (Address + Map + Geolocation) */}
        <LocationPicker
          locationName={locationName}
          setLocationName={(val) => {
            setLocationName(val);
            if (errors.locationName) setErrors((prev) => ({ ...prev, locationName: null }));
          }}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
        />
        {errors.locationName && (
          <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.locationName}</span>
          </p>
        )}

        {/* Smart Priority Live Preview Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Estimated Priority Score</p>
              <p className="text-[11px] text-slate-500">
                Calculated dynamically based on urgency + hazard context
              </p>
            </div>
          </div>
          <PriorityBadge
            urgency={urgency}
            score={liveScore.score}
            reasons={liveScore.reasons}
          />
        </div>

        {/* Form Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report'}</span>
          </button>
        </div>
      </form>

      {/* Duplicate warning modal */}
      <DuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicates={duplicateMatches}
        onProceedAnyway={handleProceedDuplicate}
        onViewExisting={(rep) => {
          setIsDuplicateModalOpen(false);
          if (onClose) onClose();
          if (onViewReport) onViewReport(rep);
        }}
        onUpvoteExisting={(repId) => {
          setIsDuplicateModalOpen(false);
          if (onUpvoteReport) onUpvoteReport(repId);
          if (onClose) onClose();
          addToast('Thank you! We recorded your confirmation on the existing issue.', 'success');
        }}
      />
    </div>
  );
}
