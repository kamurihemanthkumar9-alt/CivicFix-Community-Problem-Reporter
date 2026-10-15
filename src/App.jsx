import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MetricCards } from './components/dashboard/MetricCards';
import { CategoryChart } from './components/dashboard/CategoryChart';
import { PriorityChart } from './components/dashboard/PriorityChart';
import { FilterBar } from './components/dashboard/FilterBar';
import { ReportCard } from './components/dashboard/ReportCard';
import { ReportForm } from './components/report/ReportForm';
import { CommunityMap } from './components/map/CommunityMap';
import { ReportDetails } from './components/details/ReportDetails';
import { ComplaintTracker } from './components/details/ComplaintTracker';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Modal } from './components/common/Modal';
import { SupabaseModal } from './components/common/SupabaseModal';
import { ToastProvider, useToast } from './components/common/Toast';
import { db } from './services/db';
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  TrendingUp,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';

function CivicFixApp() {
  const { addToast } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'map', 'tracker', 'admin'
  const [selectedReport, setSelectedReport] = useState(null);

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dashboard Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'priority', 'upvotes'

  // Fetch all reports
  const fetchReports = useCallback(async () => {
    try {
      const data = await db.getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      addToast('Error loading reports. Using local data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Submit new report
  const handleCreateReport = async (reportData) => {
    const created = await db.createReport(reportData);
    setReports((prev) => [created, ...prev]);
    // Optionally open the newly created report
    setSelectedReport(created);
    return created;
  };

  // Upvote report
  const handleUpvote = async (id) => {
    try {
      const updated = await db.upvoteReport(id);
      if (updated) {
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        if (selectedReport && selectedReport.id === id) {
          setSelectedReport(updated);
        }
        addToast('Confirmed issue! Priority score updated.', 'success');
      }
    } catch (err) {
      addToast('Failed to confirm report', 'error');
    }
  };

  // Admin status update
  const handleUpdateStatus = async ({ id, status, comment, changedBy }) => {
    const updated = await db.updateReportStatus(id, status, comment, changedBy);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport(updated);
    }
    return updated;
  };

  // Admin priority update
  const handleUpdatePriority = async (id, urgency) => {
    const updated = await db.updateReportPriority(id, urgency);
    if (updated) {
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(updated);
      }
    }
  };

  // Reset demo data
  const handleResetDemoData = () => {
    if (window.confirm('Reset local demo data to default sample complaints (potholes, garbage, lighting)?')) {
      const resetList = db.resetDemoData();
      setReports(resetList);
      setSelectedReport(null);
      addToast('Demo data successfully restored to sample state', 'info');
    }
  };

  // Complaint ID quick search from Navbar
  const handleSearchComplaintId = (queryId) => {
    const target = reports.find(
      (r) => r.complaint_id?.toLowerCase() === queryId.toLowerCase()
    );
    if (target) {
      setSelectedReport(target);
      setActiveTab('dashboard');
    } else {
      addToast(`No complaint found with ID "${queryId}". Searching in list...`, 'warning');
      setSearchQuery(queryId);
      setSelectedReport(null);
      setActiveTab('dashboard');
    }
  };

  // Filtered & sorted reports for dashboard feed
  const filteredReports = useMemo(() => {
    let result = reports.filter((r) => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedUrgency !== 'all' && (r.urgency || 'Medium') !== selectedUrgency) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title?.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q);
        const matchesLoc = r.location_name?.toLowerCase().includes(q);
        const matchesId = r.complaint_id?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesId) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        return (b.priority_score || 0) - (a.priority_score || 0);
      }
      if (sortBy === 'upvotes') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return result;
  }, [reports, selectedCategory, selectedStatus, selectedUrgency, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedReport(null);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onSearchComplaintId={handleSearchComplaintId}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedReport(null);
          }}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onResetDemoData={handleResetDemoData}
          totalReportsCount={reports.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 lg:pb-8">
          {/* Detailed view takes priority if a report is selected */}
          {selectedReport ? (
            <ReportDetails
              report={selectedReport}
              onBack={() => setSelectedReport(null)}
              onUpvote={handleUpvote}
              onOpenAdminUpdate={() => {
                setIsAdmin(true);
                setActiveTab('admin');
              }}
              isAdmin={isAdmin}
            />
          ) : activeTab === 'dashboard' ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Civic Hero Header Banner */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-time Citizen Action & Resolution Platform</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Fix Neighborhood Problems Faster Together.
                  </h1>
                  <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                    Report potholes, broken streetlights, water leaks, and illegal dumping. Pin locations, upload photos, and track verified repairs by municipal teams.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                      <span>Report a Problem Now</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('map')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>View Community Map</span>
                    </button>
                  </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
              </div>

              {/* Dynamic KPI Summary Cards */}
              <MetricCards
                reports={reports}
                activeStatusFilter={selectedStatus}
                onSelectStatusFilter={(status) => setSelectedStatus(status)}
              />

              {/* Analytics Section: Category Donut & Urgency Bars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800">
                        Category Breakdown
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Issue types</span>
                  </div>
                  <CategoryChart reports={reports} />
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800">
                        Urgency & Status Distribution
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Municipal triage</span>
                  </div>
                  <PriorityChart reports={reports} />
                </div>
              </div>

              {/* Filter Bar */}
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedUrgency={selectedUrgency}
                setSelectedUrgency={setSelectedUrgency}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* Recent Complaints Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Recent Community Complaints</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      {filteredReports.length}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Click any card for full resolution timeline & photo
                  </span>
                </div>

                {filteredReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onSelectReport={(r) => setSelectedReport(r)}
                        onUpvote={handleUpvote}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                    <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">No complaints found</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No issues match your current filters. Try resetting search or report a new issue.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                        setSelectedUrgency('all');
                      }}
                      className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'map' ? (
            <CommunityMap
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          ) : activeTab === 'tracker' ? (
            <ComplaintTracker
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
            />
          ) : activeTab === 'admin' ? (
            <AdminDashboard
              reports={reports}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onResetDemoData={handleResetDemoData}
              onSelectReport={(r) => setSelectedReport(r)}
            />
          ) : null}
        </main>
      </div>

      {/* Mobile Drawer & Bottom Bar */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedReport(null);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onResetDemoData={handleResetDemoData}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Report Problem Modal Dialog */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report a Community Problem"
        maxWidth="max-w-2xl"
      >
        <ReportForm
          existingReports={reports}
          onSubmitReport={handleCreateReport}
          onViewReport={(rep) => {
            setIsReportModalOpen(false);
            setSelectedReport(rep);
          }}
          onUpvoteReport={handleUpvote}
          onClose={() => setIsReportModalOpen(false)}
        />
      </Modal>

      {/* Supabase / Demo Settings Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={fetchReports}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CivicFixApp />
    </ToastProvider>
  );
}
