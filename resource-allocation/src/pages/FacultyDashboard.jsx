import React, { useState } from "react";
import "./FacultyDashboard.css";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard",        icon: HomeIcon,        path: "/faculty-dashboard" },
  { label: "Show Resources", icon: SearchIcon,      path: "/browse-resources" },
  { label: "My Requests",      icon: RequestsIcon,    path: "/my-requests" },
  { label: "Profile",          icon: ProfileIcon,     path: "/profile" },
  { label: "Logout",           icon: LogoutIcon,      path: "/login" },
];

const RESOURCES = ["Computer Lab 1", "Seminar Hall", "Physics Lab", "Smart Classroom 1"];

const WEEK_DATES = [
  { date: "24 May", day: "Sat" },
  { date: "25 May", day: "Sun" },
  { date: "26 May", day: "Mon" },
  { date: "27 May", day: "Tue" },
  { date: "28 May", day: "Wed" },
  { date: "29 May", day: "Thu" },
  { date: "30 May", day: "Fri" },
];

// status: "Empty" | "Booked" | "Pending"
const AVAILABILITY = {
  "Computer Lab 1":    ["Booked",  "Pending", "Empty",  "Booked",  "Empty",  "Pending", "Empty"],
  "Seminar Hall":      ["Empty",   "Empty",   "Booked", "Pending", "Empty",  "Booked",  "Empty"],
  "Physics Lab":       ["Booked",  "Pending", "Pending","Empty",   "Booked", "Empty",   "Empty"],
  "Smart Classroom 1": ["Empty",   "Booked",  "Empty",  "Empty",   "Pending","Empty",   "Booked"],
};

function FacultyDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");

  const handleNav = (item) => {
    setActiveNav(item.label);
    if (item.label === "Dashboard") navigate("/faculty-dashboard");
    if (item.label === "My Requests") navigate("/my-requests");
    if (item.label === "Logout") navigate(item.path);
    if (item.label == "Show Resources") navigate("/show-resources");

  };

  return (
    <div className="fd-root">
      {/* ── Sidebar ── */}
      <aside className="fd-sidebar">
        <div className="fd-brand">
          <span className="fd-brand-icon">
            <GridIcon />
          </span>
          <span className="fd-brand-text">Resource Allocation<br />System</span>
        </div>

        <nav className="fd-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`fd-nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => handleNav(item)}
            >
              <span className="fd-nav-icon"><item.icon /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="fd-main">
        {/* Top bar */}
        <header className="fd-header">
          <div className="fd-welcome">
            <h1>Welcome back, Dr. Emily Davis!</h1>
            <p>Here's an overview of your resources and bookings.</p>
          </div>
          <div className="fd-header-right">
            <button className="fd-notif-btn">
              <BellIcon />
              <span className="fd-notif-badge">2</span>
            </button>
            <div className="fd-user-info">
              <div className="fd-avatar">E</div>
              <div className="fd-user-text">
                <span className="fd-user-name">Dr. Emily Davis</span>
                <span className="fd-user-role">Faculty</span>
              </div>
              <ChevronIcon />
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <section className="fd-stats-grid">
          <StatCard
            icon={<BookingCardIcon />}
            iconBg="var(--stat-blue-bg)"
            value="6"
            label="My Bookings"
            sub="Upcoming & Confirmed"
          />
          <StatCard
            icon={<RequestCardIcon />}
            iconBg="var(--stat-orange-bg)"
            value="3"
            label="My Requests"
            sub="Pending Approval"
          />
          <StatCard
            icon={<ApprovedCardIcon />}
            iconBg="var(--stat-green-bg)"
            value="4"
            label="Approved"
            sub="This Month"
          />
          <StatCard
            icon={<CancelledCardIcon />}
            iconBg="var(--stat-red-bg)"
            value="1"
            label="Cancelled"
            sub="This Month"
          />
        </section>

        {/* Availability Overview */}
        <section className="fd-avail-section">
          <div className="fd-avail-header">
            <div>
              <h2 className="fd-avail-title">Availability Overview</h2>
              <p className="fd-avail-sub">View resource availability for the week.</p>
            </div>
            <button className="fd-view-calendar-btn" onClick={() => navigate("/resource-calendar")}>
                <CalendarIcon />
                View Calendar
            </button>
          </div>

          <div className="fd-table-wrapper">
            <table className="fd-table">
              <thead>
                <tr>
                  <th className="fd-th-resource">Resource</th>
                  {WEEK_DATES.map((d) => (
                    <th key={d.date} className="fd-th-date">
                      <span className="fd-date-label">{d.date}</span>
                      <span className="fd-day-label">{d.day}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESOURCES.map((res) => (
                  <tr key={res} className="fd-tr">
                    <td className="fd-td-resource">{res}</td>
                    {AVAILABILITY[res].map((status, i) => (
                      <td key={i} className="fd-td-status">
                        <span className={`fd-badge fd-badge--${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="fd-legend">
            <span className="fd-legend-item"><span className="fd-dot fd-dot--empty" />Empty</span>
            <span className="fd-legend-item"><span className="fd-dot fd-dot--booked" />Booked</span>
            <span className="fd-legend-item"><span className="fd-dot fd-dot--pending" />Pending</span>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, iconBg, value, label, sub }) {
  return (
    <div className="fd-stat-card">
      <div className="fd-stat-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="fd-stat-body">
        <span className="fd-stat-label">{label}</span>
        <span className="fd-stat-value">{value}</span>
        <span className="fd-stat-sub">{sub}</span>
      </div>
    </div>
  );
}

/* ── SVG Icons ── */
export function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
      <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
      <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
      <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
    </svg>
  );
}
export function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}
export function RequestsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
export function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
export function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
export function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}
export function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
export function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
export function BookingCardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
export function RequestCardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
export function ApprovedCardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
export function CancelledCardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}

export default FacultyDashboard;