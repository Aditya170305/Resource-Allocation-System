import React, { useState } from "react";
import "./HodDashboard.css";
import { useNavigate } from "react-router-dom";

/* ─── Nav ─────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard",        Icon: HomeIcon,      path: "/hod-dashboard"       },
  { label: "Booking Requests", Icon: RequestsIcon,  path: "/hod-booking-requests" },
  { label: "All Bookings",     Icon: BookingsIcon,  path: "/hod-all-bookings"     },
  { label: "Resources",        Icon: ResourcesIcon, path: "/hod-resources"        },
  { label: "Reports",          Icon: ReportsIcon,   path: "/hod-reports"          },
  { label: "Profile",          Icon: ProfileIcon,   path: "/hod-profile"          },
  { label: "Logout",           Icon: LogoutIcon,    path: "/login"                },
];

/* ─── Pending Requests Data ───────────────────── */
const INIT_REQUESTS = [
  { id: "#RQ001", resource: "Computer Lab 1",  requestedBy: "Dr. Emily Davis",  date: "23 May 2025", time: "10:00 AM – 12:00 PM", status: "pending" },
  { id: "#RQ002", resource: "Smart Classroom", requestedBy: "Prof. John Smith", date: "23 May 2025", time: "02:00 PM – 04:00 PM", status: "pending" },
  { id: "#RQ003", resource: "Seminar Hall",    requestedBy: "Dr. Sarah Wilson", date: "24 May 2025", time: "11:00 AM – 01:00 PM", status: "pending" },
  { id: "#RQ004", resource: "Physics Lab",     requestedBy: "Dr. Raj Patel",    date: "24 May 2025", time: "09:00 AM – 11:00 AM", status: "pending" },
  { id: "#RQ005", resource: "Computer Lab 1",  requestedBy: "Prof. Anita Roy",  date: "25 May 2025", time: "03:00 PM – 05:00 PM", status: "pending" },
];

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HodDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [requests, setRequests]   = useState(INIT_REQUESTS);
  const [toast, setToast]         = useState(null); // { msg, type }

  /* ── Stats derived from state ── */
  const totalRequests  = requests.length;
  const pendingCount   = requests.filter(r => r.status === "pending").length;
  const approvedCount  = requests.filter(r => r.status === "approved").length;
  const rejectedCount  = requests.filter(r => r.status === "rejected").length;
  const totalResources = 18;

  /* ── Handlers ── */
  const handleNav = (item) => {
    setActiveNav(item.label);
    if (item.label == "All Bookings") navigate("/hod-all-bookings");
    if (item.label == "Resources") navigate("/hod-resources");
    // if (item.label == "Reports") navigate("/hod-reports"); 
    if (item.label === "Logout") navigate(item.path);
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    showToast(`Request ${id} has been approved.`, "success");
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    showToast(`Request ${id} has been rejected.`, "error");
  };

  const pendingRows = requests.filter(r => r.status === "pending");

  /* ═══ RENDER ═══ */
  return (
    <div className="hod-root">

      {/* ── Sidebar ──────────────────────── */}
      <aside className="hod-sidebar">
        <div className="hod-brand">
          <span className="hod-brand-icon"><GridIcon /></span>
          <span className="hod-brand-text">Resource Allocation<br />System</span>
        </div>
        <nav className="hod-nav">
          {NAV_ITEMS.map(({ label, Icon, path }) => (
            <button
              key={label}
              className={`hod-nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => handleNav({ label, path })}
            >
              <span className="hod-nav-icon"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ─────────────────────────── */}
      <div className="hod-main">

        {/* Header */}
        <header className="hod-header">
          <div>
            <h1 className="hod-title">Dashboard</h1>
            <p className="hod-subtitle">Welcome back, Dr. Michael Brown!</p>
          </div>
          <div className="hod-header-right">
            <button className="hod-notif-btn">
              <BellIcon />
              <span className="hod-notif-badge">3</span>
            </button>
            <div className="hod-user-chip">
              <div className="hod-avatar">M</div>
              <div className="hod-user-text">
                <span className="hod-user-name">Dr. Michael Brown</span>
                <span className="hod-user-role">HOD – CSE Department</span>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="hod-content">

          {/* ── Stat Cards ───────────────── */}
          <div className="hod-stats">
            <StatCard
              icon={<TotalReqIcon />}   iconBg="hod-stat-icon--blue"
              value={totalRequests}     label="Total Requests"   sub="This Month"
            />
            <StatCard
              icon={<PendingReqIcon />} iconBg="hod-stat-icon--orange"
              value={pendingCount}      label="Pending Requests" sub="Need Approval"
            />
            <StatCard
              icon={<ApprovedReqIcon />} iconBg="hod-stat-icon--green"
              value={approvedCount}     label="Approved"         sub="This Month"
            />
            <StatCard
              icon={<TotalResIcon />}   iconBg="hod-stat-icon--teal"
              value={totalResources}    label="Total Resources"  sub="In Department"
            />
          </div>

          {/* ── Pending Requests Table ────── */}
          <div className="hod-table-section">
            <div className="hod-table-header">
              <div>
                <h2 className="hod-table-title">Pending Requests</h2>
                <p className="hod-table-sub">Review and action faculty booking requests.</p>
              </div>
              <span className="hod-pending-pill">{pendingCount} Pending</span>
            </div>

            {pendingRows.length === 0 ? (
              <div className="hod-empty">
                <AllDoneIcon />
                <p>All requests have been actioned. Nothing pending!</p>
              </div>
            ) : (
              <div className="hod-table-wrap">
                <table className="hod-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Resource</th>
                      <th>Requested By</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRows.map((r) => (
                      <tr key={r.id} className="hod-tr">
                        <td><span className="hod-req-id">{r.id}</span></td>
                        <td><span className="hod-resource-name">{r.resource}</span></td>
                        <td><span className="hod-faculty-name">{r.requestedBy}</span></td>
                        <td><span className="hod-date">{r.date}</span></td>
                        <td><span className="hod-time">{r.time}</span></td>
                        <td>
                          <div className="hod-action-btns">
                            <button
                              className="hod-btn-approve"
                              onClick={() => handleApprove(r.id)}
                            >
                              <CheckSmallIcon /> Approve
                            </button>
                            <button
                              className="hod-btn-reject"
                              onClick={() => handleReject(r.id)}
                            >
                              <XSmallIcon /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Recent Activity (approved/rejected) ── */}
          {(approvedCount > 0 || rejectedCount > 0) && (
            <div className="hod-activity-section">
              <h2 className="hod-table-title" style={{ marginBottom: "14px" }}>Recent Actions</h2>
              <div className="hod-activity-list">
                {requests
                  .filter(r => r.status !== "pending")
                  .map(r => (
                    <div key={r.id} className={`hod-activity-row hod-activity-row--${r.status}`}>
                      <span className={`hod-activity-dot hod-activity-dot--${r.status}`} />
                      <span className="hod-activity-id">{r.id}</span>
                      <span className="hod-activity-resource">{r.resource}</span>
                      <span className="hod-activity-by">{r.requestedBy}</span>
                      <span className="hod-activity-time">{r.time}</span>
                      <span className={`hod-activity-badge hod-activity-badge--${r.status}`}>
                        {r.status === "approved" ? "Approved" : "Rejected"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`hod-toast hod-toast--${toast.type}`}>
          {toast.type === "success" ? <CheckSmallIcon /> : <XSmallIcon />}
          {toast.msg}
        </div>
      )}

    </div>
  );
}

/* ─── Stat Card ─────────────────────────────── */
function StatCard({ icon, iconBg, value, label, sub }) {
  return (
    <div className="hod-stat">
      <div className={`hod-stat-icon ${iconBg}`}>{icon}</div>
      <div className="hod-stat-body">
        <span className="hod-stat-label">{label}</span>
        <span className="hod-stat-value">{value}</span>
        <span className="hod-stat-sub">{sub}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════ */
function GridIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/></svg>;
}
function HomeIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
}
function RequestsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function BookingsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function ResourcesIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
}
function ReportsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function ProfileIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
}
function LogoutIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
function BellIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
}
function ChevronDownIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>;
}
function CheckSmallIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
}
function XSmallIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function TotalReqIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}
function PendingReqIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
}
function ApprovedReqIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>;
}
function TotalResIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
}
function AllDoneIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>;
}