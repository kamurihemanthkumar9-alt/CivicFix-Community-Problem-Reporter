import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { PRESET_PHOTOS } from '../../data/sampleReports';

export function ImageUploader({ photoUrl, setPhotoUrl, selectedCategory }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (presetUrl) => {
    setPhotoUrl(presetUrl);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
        <span>Photo Proof</span>
        <span className="text-[11px] font-normal text-slate-400">JPG, PNG, WebP up to 5MB</span>
      </label>

      {photoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <img
            src={photoUrl}
            alt="Complaint upload preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow-md hover:bg-slate-50 transition-colors"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={() => setPhotoUrl('')}
              className="p-1.5 bg-rose-600 text-white rounded-lg shadow-md hover:bg-rose-700 transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-600 hover:underline">
              Click to upload photo
            </span>{' '}
            <span className="text-xs text-slate-500">or drag and drop</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Clear photos help municipal teams verify and resolve problems faster.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preset demo quick photos */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Or choose sample photo for demo:</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_PHOTOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset.url)}
              className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                photoUrl === preset.url
                  ? 'ring-2 ring-blue-600 border-blue-600 scale-95'
                  : 'border-slate-200 hover:border-blue-400 opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-full h-12 object-cover"
                loading="lazy"
              />
              <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white text-[9px] font-medium px-1 py-0.5 truncate text-center block">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
