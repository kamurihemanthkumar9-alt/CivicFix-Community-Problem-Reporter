import React, { useState } from 'react';
import { Modal } from './Modal';
import { Database, CheckCircle2, ShieldCheck, Key, Server, RefreshCw, AlertCircle } from 'lucide-react';
import { getSupabaseConfig, saveRuntimeSupabaseConfig } from '../../config/supabase';
import { useToast } from './Toast';

export function SupabaseModal({ isOpen, onClose, onConfigSaved }) {
  const { addToast } = useToast();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.key || '');
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (url && !url.startsWith('https://')) {
      addToast('Supabase URL must start with https://', 'error');
      return;
    }

    saveRuntimeSupabaseConfig(url, key);
    addToast('Supabase settings updated. Refreshing connection...', 'success');
    if (onConfigSaved) onConfigSaved();
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 600);
  };

  const handleResetToDemo = () => {
    saveRuntimeSupabaseConfig('', '');
    setUrl('');
    setKey('');
    addToast('Switched to Local Demo Mode (localStorage)', 'info');
    if (onConfigSaved) onConfigSaved();
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Backend & Database Configuration" maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Status Pill */}
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          currentConfig.isConfigured
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-blue-50/70 border-blue-200 text-blue-900'
        }`}>
          <div className="p-2 rounded-lg bg-white shadow-sm flex-shrink-0">
            <Database className={`w-5 h-5 ${currentConfig.isConfigured ? 'text-emerald-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              <span>Status: {currentConfig.isConfigured ? 'Connected to Supabase Cloud' : 'Running in Local Demo Mode'}</span>
            </div>
            <p className="text-xs mt-1 text-slate-600 leading-relaxed">
              {currentConfig.isConfigured
                ? 'All complaints, photos, and updates are synchronized in real-time with your remote Supabase PostgreSQL database.'
                : 'Using browser localStorage with preloaded realistic civic sample complaints. No account or backend setup required for demonstration.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Supabase Anon Public API Key</span>
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono text-xs text-slate-800"
            />
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
            <span className="font-semibold text-slate-700">Need schema setup?</span> The complete SQL schema with RLS policies is ready in <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">supabase/schema.sql</code>. Copy & paste it into Supabase SQL Editor.
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToDemo}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Reset to Demo Mode
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all shadow-blue-500/20"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
