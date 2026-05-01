import React, { useState } from "react";
import "./MyRequests.css";
import { useNavigate } from "react-router-dom";

/* ─── Sample Data ─────────────────────────────── */
const INITIAL_BOOKINGS = [
  {
    id: 1,
    resource: "Computer Lab 1",
    resourceType: "Lab",
    date: "26 May 2025",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    purpose: "Lab Session for CSE students",
    status: "Confirmed",
    bookedOn: "20 May 2025",
  },
  {
    id: 2,
    resource: "Seminar Hall",
    resourceType: "Hall",
    date: "27 May 2025",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    purpose: "Guest Lecture on AI",
    status: "Pending",
    bookedOn: "21 May 2025",
  },
  {
    id: 3,
    resource: "Physics Lab",
    resourceType: "Lab",
    date: "28 May 2025",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    purpose: "Practical Exam – Batch B",
    status: "Confirmed",
    bookedOn: "19 May 2025",
  },
  {
    id: 4,
    resource: "Smart Classroom 1",
    resourceType: "Classroom",
    date: "24 May 2025",
    startTime: "11:00 AM",
    endTime: "01:00 PM",
    purpose: "Online Project Presentation",
    status: "Cancelled",
    bookedOn: "18 May 2025",
  },
  {
    id: 5,
    resource: "Computer Lab 1",
    resourceType: "Lab",
    date: "30 May 2025",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    purpose: "Seminar – Dr. Sarah Wilson",
    status: "Pending",
    bookedOn: "22 May 2025",
  },
  {
    id: 6,
    resource: "Seminar Hall",
    resourceType: "Hall",
    date: "29 May 2025",
    startTime: "08:00 AM",
    endTime: "10:00 AM",
    purpose: "Department Meeting",
    status: "Confirmed",
    bookedOn: "21 May 2025",
  },
];

const RESOURCES = [
  "Computer Lab 1",
  "Seminar Hall",
  "Physics Lab",
  "Smart Classroom 1",
];

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
];

const NAV_ITEMS = [
  { label: "Dashboard",        Icon: HomeIcon    },
  { label: "Browse Resources", Icon: SearchIcon  },
//   { label: "My Bookings",      Icon: CalendarIcon },
  { label: "My Requests",      Icon: RequestIcon  },
  { label: "Profile",          Icon: ProfileIcon  },
  { label: "Logout",           Icon: LogoutIcon   },
];

const TABS = ["All", "Confirmed", "Pending", "Cancelled"];

/* ─── Resource Icons Map ──────────────────────── */
const RESOURCE_ICON = {
  Lab:       LabIcon,
  Hall:      HallIcon,
  Classroom: ClassroomIcon,
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function MyRequests() {
  const navigate = useNavigate();
  const [activeNav,   setActiveNav]   = useState("My Requests");
  const [activeTab,   setActiveTab]   = useState("All");
  const [bookings,    setBookings]    = useState(INITIAL_BOOKINGS);
  const [showModal,   setShowModal]   = useState(false);
  const [cancelId,    setCancelId]    = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── Form state ── */
  const [form, setForm] = useState({
    resource: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  const [formError, setFormError] = useState("");

  /* ── Stats ── */
  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending:   bookings.filter(b => b.status === "Pending").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  /* ── Filtered bookings ── */
  const filtered = activeTab === "All"
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  /* ── Handlers ── */
  const handleNav = (item) => {
    setActiveNav(item.label);
    if (item.label === "Logout")    navigate("/login");
    if (item.label === "Dashboard") navigate("/faculty-dashboard");
    if (item.label === "My Requests") navigate("/my-requests");
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.resource || !form.date || !form.startTime || !form.endTime || !form.purpose.trim()) {
      setFormError("Please fill in all fields before submitting.");
      return;
    }
    if (form.startTime >= form.endTime) {
      setFormError("End time must be after start time.");
      return;
    }
    const dateObj = new Date(form.date);
    const formatted = dateObj.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
    const newBooking = {
      id: Date.now(),
      resource:     form.resource,
      resourceType: RESOURCES.indexOf(form.resource) === 1 ? "Hall"
                  : RESOURCES.indexOf(form.resource) === 3 ? "Classroom"
                  : "Lab",
      date:      formatted,
      startTime: form.startTime,
      endTime:   form.endTime,
      purpose:   form.purpose,
      status:    "Pending",
      bookedOn:  new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
    };
    setBookings(prev => [newBooking, ...prev]);
    setShowModal(false);
    setForm({ resource:"", date:"", startTime:"", endTime:"", purpose:"" });
    setFormError("");
  };

  const handleCancelClick = (id) => {
    setCancelId(id);
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    setBookings(prev =>
      prev.map(b => b.id === cancelId ? { ...b, status: "Cancelled" } : b)
    );
    setShowConfirm(false);
    setCancelId(null);
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="mb-root">

      {/* ── Sidebar ────────────────────────── */}
      <aside className="mb-sidebar">
        <div className="mb-brand">
          <span className="mb-brand-icon"><GridIcon /></span>
          <span className="mb-brand-text">Resource Allocation<br />System</span>
        </div>
        <nav className="mb-nav">
          {NAV_ITEMS.map(({ label, Icon }) => (
            <button
              key={label}
              className={`mb-nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => handleNav({ label })}
            >
              <span className="mb-nav-icon"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ───────────────────────────── */}
      <div className="mb-main">

        {/* Header */}
        <header className="mb-header">
          <div>
            <h1 className="mb-title">My Bookings</h1>
            <p className="mb-subtitle">Manage and track all your resource reservations.</p>
          </div>
          <div className="mb-header-right">
            <button className="mb-notif-btn">
              <BellIcon />
              <span className="mb-notif-badge">2</span>
            </button>
            <div className="mb-user-chip">
              <div className="mb-avatar">E</div>
              <div className="mb-user-text">
                <span className="mb-user-name">Dr. Emily Davis</span>
                <span className="mb-user-role">Faculty</span>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="mb-content">

          {/* Stats */}
          <div className="mb-stats">
            <StatCard value={stats.total}     label="Total Bookings"   color="blue"   icon={<TotalIcon />}     />
            <StatCard value={stats.confirmed} label="Confirmed"        color="green"  icon={<ConfirmedIcon />} />
            <StatCard value={stats.pending}   label="Pending Approval" color="orange" icon={<PendingIcon />}   />
            <StatCard value={stats.cancelled} label="Cancelled"        color="red"    icon={<CancelledIcon />} />
          </div>

          {/* Toolbar */}
          <div className="mb-toolbar">
            <div className="mb-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`mb-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span className="mb-tab-count">
                    {tab === "All" ? bookings.length : bookings.filter(b => b.status === tab).length}
                  </span>
                </button>
              ))}
            </div>
            <button className="mb-new-btn" onClick={() => setShowModal(true)}>
              <PlusIcon />
              New Booking Request
            </button>
          </div>

          {/* Booking Cards */}
          {filtered.length === 0 ? (
            <div className="mb-empty">
              <EmptyIcon />
              <p>No {activeTab === "All" ? "" : activeTab.toLowerCase()} bookings found.</p>
            </div>
          ) : (
            <div className="mb-cards">
              {filtered.map(b => {
                const RIcon = RESOURCE_ICON[b.resourceType] || LabIcon;
                return (
                  <div key={b.id} className={`mb-card mb-card--${b.status.toLowerCase()}`}>
                    <div className="mb-card-left">
                      <div className={`mb-card-icon mb-card-icon--${b.resourceType.toLowerCase()}`}>
                        <RIcon />
                      </div>
                    </div>

                    <div className="mb-card-body">
                      <div className="mb-card-top">
                        <div>
                          <h3 className="mb-card-resource">{b.resource}</h3>
                          <span className="mb-card-type">{b.resourceType}</span>
                        </div>
                        <span className={`mb-badge mb-badge--${b.status.toLowerCase()}`}>
                          {b.status === "Confirmed" && <CheckIcon />}
                          {b.status === "Pending"   && <ClockIcon />}
                          {b.status === "Cancelled" && <XIcon />}
                          {b.status}
                        </span>
                      </div>

                      <div className="mb-card-meta">
                        <span className="mb-meta-item">
                          <CalSmallIcon />
                          {b.date}
                        </span>
                        <span className="mb-meta-item">
                          <ClockSmallIcon />
                          {b.startTime} – {b.endTime}
                        </span>
                        <span className="mb-meta-item">
                          <NoteIcon />
                          {b.purpose}
                        </span>
                      </div>
                    </div>

                    <div className="mb-card-actions">
                      <span className="mb-booked-on">Booked on {b.bookedOn}</span>
                      {b.status !== "Cancelled" && (
                        <button
                          className="mb-cancel-btn"
                          onClick={() => handleCancelClick(b.id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══ New Booking Modal ══════════════ */}
      {showModal && (
        <div className="mb-overlay" onClick={() => setShowModal(false)}>
          <div className="mb-modal" onClick={e => e.stopPropagation()}>
            <div className="mb-modal-header">
              <div>
                <h2 className="mb-modal-title">New Booking Request</h2>
                <p className="mb-modal-sub">Fill in the details to request a resource.</p>
              </div>
              <button className="mb-modal-close" onClick={() => setShowModal(false)}>
                <XIcon />
              </button>
            </div>

            <form className="mb-form" onSubmit={handleSubmit}>
              <div className="mb-form-group">
                <label className="mb-label">Resource</label>
                <select name="resource" className="mb-select" value={form.resource} onChange={handleFormChange} required>
                  <option value="">Select a resource</option>
                  {RESOURCES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="mb-form-group">
                <label className="mb-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="mb-input"
                  value={form.date}
                  onChange={handleFormChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="mb-form-row">
                <div className="mb-form-group">
                  <label className="mb-label">Start Time</label>
                  <select name="startTime" className="mb-select" value={form.startTime} onChange={handleFormChange} required>
                    <option value="">Select start time</option>
                    {TIME_SLOTS.slice(0, -1).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mb-form-group">
                  <label className="mb-label">End Time</label>
                  <select name="endTime" className="mb-select" value={form.endTime} onChange={handleFormChange} required>
                    <option value="">Select end time</option>
                    {TIME_SLOTS.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-form-group">
                <label className="mb-label">Purpose / Note</label>
                <textarea
                  name="purpose"
                  className="mb-textarea"
                  placeholder="Describe the purpose of your booking..."
                  value={form.purpose}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              {formError && (
                <div className="mb-form-error">
                  <InfoIcon /> {formError}
                </div>
              )}

              <div className="mb-form-actions">
                <button type="button" className="mb-btn-cancel" onClick={() => { setShowModal(false); setFormError(""); }}>
                  Cancel
                </button>
                <button type="submit" className="mb-btn-submit">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ Cancel Confirmation Dialog ═════ */}
      {showConfirm && (
        <div className="mb-overlay" onClick={() => setShowConfirm(false)}>
          <div className="mb-confirm" onClick={e => e.stopPropagation()}>
            <div className="mb-confirm-icon"><WarnIcon /></div>
            <h3 className="mb-confirm-title">Cancel This Booking?</h3>
            <p className="mb-confirm-msg">This action cannot be undone. The time slot will be released.</p>
            <div className="mb-confirm-actions">
              <button className="mb-btn-cancel" onClick={() => setShowConfirm(false)}>Keep Booking</button>
              <button className="mb-btn-danger" onClick={confirmCancel}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ─── Stat Card ─────────────────────────────── */
function StatCard({ value, label, color, icon }) {
  return (
    <div className={`mb-stat mb-stat--${color}`}>
      <div className={`mb-stat-icon mb-stat-icon--${color}`}>{icon}</div>
      <div>
        <p className="mb-stat-value">{value}</p>
        <p className="mb-stat-label">{label}</p>
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
function SearchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>;
}
function CalendarIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function RequestIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
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
function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
}
function ClockIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
}
function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function CalSmallIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function ClockSmallIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
}
function NoteIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>;
}
function InfoIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>;
}
function WarnIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function EmptyIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function TotalIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function ConfirmedIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>;
}
function PendingIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
}
function CancelledIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
}
function LabIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3h6M9 3v6l-4 9a1 1 0 00.9 1.5h12.2A1 1 0 0019 18l-4-9V3"/><line x1="6.5" y1="14" x2="17.5" y2="14"/></svg>;
}
function HallIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function ClassroomIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
}