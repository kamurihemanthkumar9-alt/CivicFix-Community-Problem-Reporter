import { getSupabaseClient, getSupabaseConfig } from '../config/supabase.js';
import { INITIAL_REPORTS } from '../data/sampleReports.js';
import { calculatePriorityScore } from './priorityScorer.js';

const LOCAL_STORAGE_KEY = 'civicfix_reports_v1';

let inMemoryStore = null;

const setLocalItem = (key, val) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, val);
  } else {
    inMemoryStore = JSON.parse(val);
  }
};

// Initialize local storage with default sample reports if empty
export function initLocalStore() {
  if (typeof localStorage === 'undefined') {
    if (!inMemoryStore) inMemoryStore = [...INITIAL_REPORTS];
    return inMemoryStore;
  }
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
  try {
    return JSON.parse(existing);
  } catch (err) {
    console.error('Error parsing localStorage reports:', err);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
}

export const db = {
  // Check active mode
  getMode() {
    const { isConfigured, url } = getSupabaseConfig();
    return {
      isSupabase: isConfigured,
      mode: isConfigured ? 'Supabase Cloud' : 'Local Demo Mode',
      supabaseUrl: url || null
    };
  },

  // Fetch all reports
  async getAllReports() {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('reports')
          .select(`
            *,
            status_history (*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data;
        // If Supabase table is empty, allow user to seed or return empty array
        return data || [];
      } catch (err) {
        console.warn('Supabase query failed, falling back to local store:', err.message);
      }
    }

    // Local fallback
    return initLocalStore();
  },

  // Fetch single report by ID or Complaint ID
  async getReport(identifier) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const query = identifier.startsWith('CF-')
          ? client.from('reports').select('*, status_history (*)').eq('complaint_id', identifier).single()
          : client.from('reports').select('*, status_history (*)').eq('id', identifier).single();

        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getReport error:', err.message);
      }
    }

    // Local fallback
    const local = initLocalStore();
    return (
      local.find(
        (r) =>
          r.id === identifier ||
          r.complaint_id?.toLowerCase() === identifier?.toLowerCase()
      ) || null
    );
  },

  // Create a new report
  async createReport(reportInput) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const complaint_id = `CF-2026-${randomSuffix}`;
    const id = `rep-${Date.now()}`;
    const now = new Date().toISOString();

    const { score, reasons } = calculatePriorityScore({
      urgency: reportInput.urgency,
      title: reportInput.title,
      description: reportInput.description,
      locationName: reportInput.location_name,
      upvotes: 0,
      createdAt: now
    });

    const newReport = {
      id,
      complaint_id,
      title: reportInput.title.trim(),
      description: reportInput.description.trim(),
      category: reportInput.category,
      photo_url: reportInput.photo_url || null,
      location_name: reportInput.location_name.trim(),
      latitude: reportInput.latitude ? parseFloat(reportInput.latitude) : null,
      longitude: reportInput.longitude ? parseFloat(reportInput.longitude) : null,
      urgency: reportInput.urgency || 'Medium',
      priority_score: score,
      score_reasons: reasons,
      status: 'Reported',
      upvotes: 1,
      resolution_comment: '',
      created_at: now,
      updated_at: now,
      status_history: [
        {
          id: `sh-${Date.now()}`,
          status: 'Reported',
          comment: 'Complaint logged into CivicFix portal by citizen.',
          changed_by: 'Citizen',
          created_at: now
        }
      ]
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        const { status_history, ...reportDbData } = newReport;
        const { data, error } = await client
          .from('reports')
          .insert([reportDbData])
          .select()
          .single();

        if (error) throw error;

        // Insert initial status history
        await client.from('status_history').insert([
          {
            report_id: data.id,
            status: 'Reported',
            comment: 'Complaint logged into CivicFix portal by citizen.',
            changed_by: 'Citizen'
          }
        ]);

        return { ...data, status_history: newReport.status_history };
      } catch (err) {
        console.warn('Supabase insert failed, saving to local store instead:', err.message);
      }
    }

    // Save to local store
    const local = initLocalStore();
    const updated = [newReport, ...local];
    setLocalItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newReport;
  },

  // Update report status (Admin action)
  async updateReportStatus(id, newStatus, comment = '', changedBy = 'Admin') {
    const now = new Date().toISOString();
    const client = getSupabaseClient();

    if (client) {
      try {
        const updatePayload = {
          status: newStatus,
          updated_at: now
        };
        if (comment) {
          updatePayload.resolution_comment = comment;
        }

        const { data, error } = await client
          .from('reports')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Add to status history table
        await client.from('status_history').insert([
          {
            report_id: id,
            status: newStatus,
            comment: comment || `Status updated to ${newStatus}`,
            changed_by: changedBy
          }
        ]);

        return data;
      } catch (err) {
        console.warn('Supabase update failed, using local store:', err.message);
      }
    }

    // Local fallback
    const local = initLocalStore();
    const target = local.find((r) => r.id === id);
    if (!target) throw new Error('Report not found');

    target.status = newStatus;
    target.updated_at = now;
    if (comment) {
      target.resolution_comment = comment;
    }

    if (!target.status_history) target.status_history = [];
    target.status_history.push({
      id: `sh-${Date.now()}`,
      status: newStatus,
      comment: comment || `Status updated to ${newStatus}`,
      changed_by: changedBy,
      created_at: now
    });

    setLocalItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    return target;
  },

  // Update report priority / urgency (Admin action)
  async updateReportPriority(id, newUrgency) {
    const now = new Date().toISOString();
    const client = getSupabaseClient();

    if (client) {
      try {
        const { data, error } = await client
          .from('reports')
          .update({ urgency: newUrgency, updated_at: now })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase update priority error:', err.message);
      }
    }

    const local = initLocalStore();
    const target = local.find((r) => r.id === id);
    if (target) {
      target.urgency = newUrgency;
      const res = calculatePriorityScore({
        urgency: newUrgency,
        title: target.title,
        description: target.description,
        locationName: target.location_name,
        upvotes: target.upvotes,
        createdAt: target.created_at
      });
      target.priority_score = res.score;
      target.score_reasons = res.reasons;
      target.updated_at = now;
      setLocalItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
      return target;
    }
    return null;
  },

  // Citizen upvote / confirm issue
  async upvoteReport(id) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data: cur } = await client.from('reports').select('upvotes').eq('id', id).single();
        const nextVotes = (cur?.upvotes || 0) + 1;
        const { data, error } = await client
          .from('reports')
          .update({ upvotes: nextVotes })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase upvote error:', err.message);
      }
    }

    const local = initLocalStore();
    const target = local.find((r) => r.id === id);
    if (target) {
      target.upvotes = (target.upvotes || 0) + 1;
      // Recalculate priority score with new upvotes
      const res = calculatePriorityScore({
        urgency: target.urgency,
        title: target.title,
        description: target.description,
        locationName: target.location_name,
        upvotes: target.upvotes,
        createdAt: target.created_at
      });
      target.priority_score = res.score;
      target.score_reasons = res.reasons;
      setLocalItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
      return target;
    }
    return null;
  },

  // Reset to initial sample data
  resetDemoData() {
    setLocalItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  },

  // Export reports to CSV string
  exportReportsCSV(reports) {
    if (!reports || reports.length === 0) return '';
    const headers = [
      'Complaint ID',
      'Title',
      'Category',
      'Status',
      'Urgency',
      'Priority Score',
      'Location',
      'Latitude',
      'Longitude',
      'Upvotes',
      'Created At',
      'Resolution Note'
    ];

    const rows = reports.map((r) => [
      `"${r.complaint_id || ''}"`,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${r.category || ''}"`,
      `"${r.status || ''}"`,
      `"${r.urgency || ''}"`,
      r.priority_score || 0,
      `"${(r.location_name || '').replace(/"/g, '""')}"`,
      r.latitude || '',
      r.longitude || '',
      r.upvotes || 0,
      `"${r.created_at || ''}"`,
      `"${(r.resolution_comment || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
};
