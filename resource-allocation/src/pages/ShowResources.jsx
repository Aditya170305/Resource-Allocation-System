import React, { useState } from "react";
import "./ResourceCalendar.css";
import { useNavigate } from "react-router-dom";

/* ─── Constants ─────────────────────────────────── */
const HOUR_HEIGHT = 64; // px per hour
const BASE_HOUR   = 8;  // 08:00 AM
const HOURS = [8,9,10,11,12,13,14,15,16,17,18]; // labels 08:00 → 06:00 PM

const WEEK_DAYS = [
  { date: "24 May", day: "Sat", idx: 0 },
  { date: "25 May", day: "Sun", idx: 1 },
  { date: "26 May", day: "Mon", idx: 2 },
  { date: "27 May", day: "Tue", idx: 3 },
  { date: "28 May", day: "Wed", idx: 4 },
  { date: "29 May", day: "Thu", idx: 5 },
  // { date: "30 May", day: "Fri", idx: 6 },
];

const RESOURCES = [
  "Computer Lab 1",
  "Seminar Hall",
  "Physics Lab",
  "Smart Classroom 1",
];

const RESOURCE_DETAILS = {
  "Computer Lab 1":    { type: "Computer Laboratory", capacity: "40 Students", location: "Block A, Level 2", kind: "Lab",       amenities: "Wi-Fi, Projector, AC" },
  "Seminar Hall":      { type: "Seminar Hall",         capacity: "80 Students", location: "Block B, Level 1", kind: "Hall",      amenities: "Wi-Fi, Projector, AC, Mic" },
  "Physics Lab":       { type: "Science Laboratory",   capacity: "30 Students", location: "Block C, Level 2", kind: "Lab",       amenities: "Equipment, AC" },
  "Smart Classroom 1": { type: "Smart Classroom",      capacity: "60 Students", location: "Block A, Level 3", kind: "Classroom", amenities: "Smart Board, Wi-Fi, AC" },
};

/* dayIdx 0=Sat … 6=Fri */
const ALL_EVENTS = [
  // 25 May Sun
  { dayIdx: 1, start: "10:00", end: "12:00", type: "booked",    name: "Dr. Sarah Wilson",  activity: "Practical Class" },
  // 26 May Mon
  { dayIdx: 2, start: "08:00", end: "10:00", type: "available" },
  { dayIdx: 2, start: "10:00", end: "12:00", type: "booked",    name: "Dr. Michael Brown", activity: "Lab Session"     },
  { dayIdx: 2, start: "14:00", end: "16:00", type: "available" },
  // 27 May Tue
  { dayIdx: 3, start: "08:00", end: "10:00", type: "pending"   },
  { dayIdx: 3, start: "10:00", end: "12:00", type: "booked",    name: "Dr. Emily Davis",   activity: "Practical Class" },
  { dayIdx: 3, start: "14:00", end: "16:00", type: "booked",    name: "Prof. John Smith",  activity: "Workshop"        },
  // 28 May Wed
  { dayIdx: 4, start: "09:00", end: "12:00", type: "booked",    name: "Dr. Emily Davis",   activity: "Practical Class" },
  { dayIdx: 4, start: "13:00", end: "15:00", type: "available" },
  // 29 May Thu
  { dayIdx: 5, start: "08:00", end: "10:00", type: "available" },
  { dayIdx: 5, start: "11:00", end: "13:00", type: "booked",    name: "Dr. David Lee",     activity: "Project Work"    },
  { dayIdx: 5, start: "15:00", end: "17:00", type: "available" },
  // 30 May Fri
  // { dayIdx: 6, start: "10:00", end: "12:00", type: "booked",    name: "Dr. Sarah Wilson",  activity: "Seminar"         },
  // { dayIdx: 6, start: "14:00", end: "16:00", type: "available" },
];

/* ─── Helpers ────────────────────────────────────── */
function to12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

function eventStyle(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const top    = ((sh - BASE_HOUR) + sm / 60) * HOUR_HEIGHT;
  const height = ((eh * 60 + em) - (sh * 60 + sm)) / 60 * HOUR_HEIGHT - 3;
  return { top: `${top}px`, height: `${height}px` };
}

function hourLabel(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2,"0")}:00 ${ampm}`;
}

/* ─── Sidebar Nav Items ──────────────────────────── */
const NAV = [
  { label: "Dashboard",        Icon: HomeIcon     },
  { label: "Show Resources", Icon: SearchIcon   },
  { label: "My Requests",      Icon: RequestsIcon },
  { label: "Profile",          Icon: ProfileIcon  },
  { label: "Logout",           Icon: LogoutIcon   },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function ResourceCalendar() {
  const navigate  = useNavigate();
  const [activeNav, setActiveNav]   = useState("Show Resources");
  const [resource, setResource]     = useState("Computer Lab 1");
  const [viewMode, setViewMode]     = useState("week"); // "week" | "day"

  const details = RESOURCE_DETAILS[resource];
  const events  = ALL_EVENTS; // in a real app, filter by resource

  const handleNav = (item) => {
    setActiveNav(item.label);
    if (item.label === "Dashboard") navigate("/faculty-dashboard");
    if (item.label === "Logout") navigate(item.path);

  };
  return (
    <div className="rc-root">

      {/* ── Sidebar ─────────────────────── */}
      <aside className="rc-sidebar">
        <div className="rc-brand">
          <span className="rc-brand-icon"><GridIcon /></span>
          <span className="rc-brand-text">Resource Allocation<br />System</span>
        </div>
        <nav className="rc-nav">
          {NAV.map(({ label, Icon }) => (
            <button
              key={label}
              className={`rc-nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => {
                setActiveNav(label);
                if (label === "Logout")    navigate("/login");
                if (label === "Dashboard") navigate("/faculty-dashboard");
                if (label === "My Requests") navigate("/my-requests");
                if (label == "Show Resources") navigate("/show-resources");

              }}
            >
              <span className="rc-nav-icon"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ────────────────────────── */}
      <div className="rc-main">

        {/* Top header */}
        <header className="rc-header">
          <div className="rc-header-left">
            <button className="rc-back-btn" onClick={() => navigate("/faculty-dashboard")}>
              <ArrowLeftIcon />
            </button>
            <div>
              <h1 className="rc-title">Resource Availability Calendar</h1>
              <p className="rc-subtitle">View availability of resources and time slots.</p>
            </div>
          </div>
          <div className="rc-header-right">
            <button className="rc-notif-btn">
              <BellIcon />
              <span className="rc-notif-badge">2</span>
            </button>
            <div className="rc-user-chip">
              <div className="rc-avatar">E</div>
              <div className="rc-user-text">
                <span className="rc-user-name">Dr. Emily Davis</span>
                <span className="rc-user-role">Faculty</span>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        {/* Controls bar */}
        <div className="rc-controls">
          <div className="rc-resource-select-wrap">
            <label className="rc-control-label">Resource</label>
            <div className="rc-select-box">
              <select
                className="rc-select"
                value={resource}
                onChange={e => setResource(e.target.value)}
              >
                {RESOURCES.map(r => <option key={r}>{r}</option>)}
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="rc-week-nav">
            <button className="rc-nav-arrow"><ChevronLeftIcon /></button>
            <button className="rc-today-btn">Today</button>
            <button className="rc-nav-arrow"><ChevronRightIcon /></button>
          </div>

          <span className="rc-date-range">24 May – 30 May 2025</span>

          <div className="rc-view-toggle">
            <button
              className={`rc-toggle-btn ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >Week View</button>
            <button
              className={`rc-toggle-btn ${viewMode === "day" ? "active" : ""}`}
              onClick={() => setViewMode("day")}
            >Day View</button>
          </div>
        </div>

        {/* Calendar body + right panel */}
        <div className="rc-body-wrap">

          {/* ── Calendar grid ── */}
          <div className="rc-calendar">

            {/* Day headers */}
            <div className="rc-col-headers">
              <div className="rc-time-spacer" />
              {WEEK_DAYS.map(d => (
                <div key={d.idx} className="rc-col-header">
                  <span className="rc-col-date">{d.date}</span>
                  <span className="rc-col-day">{d.day}</span>
                </div>
              ))}
            </div>

            {/* Scrollable grid */}
            <div className="rc-grid-scroll">
              <div className="rc-grid-inner">

                {/* Time labels */}
                <div className="rc-time-col">
                  {HOURS.map(h => (
                    <div key={h} className="rc-time-cell">
                      <span className="rc-time-label">{hourLabel(h)}</span>
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {WEEK_DAYS.map(d => (
                  <div key={d.idx} className="rc-day-col">
                    {/* Hour grid lines */}
                    {HOURS.map(h => (
                      <div key={h} className="rc-hour-line" style={{ top: `${(h - BASE_HOUR) * HOUR_HEIGHT}px` }} />
                    ))}

                    {/* Events for this day */}
                    {events
                      .filter(ev => ev.dayIdx === d.idx)
                      .map((ev, i) => (
                        <div
                          key={i}
                          className={`rc-event rc-event--${ev.type}`}
                          style={eventStyle(ev.start, ev.end)}
                        >
                          <span className="rc-event-time">
                            {to12h(ev.start)} - {to12h(ev.end)}
                          </span>
                          {ev.type === "booked" && (
                            <>
                              <span className="rc-event-name">{ev.name}</span>
                              <span className="rc-event-activity">{ev.activity}</span>
                            </>
                          )}
                          {ev.type === "available" && (
                            <span className="rc-event-status">Available</span>
                          )}
                          {ev.type === "pending" && (
                            <span className="rc-event-status">Pending</span>
                          )}
                        </div>
                      ))
                    }
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <aside className="rc-panel">

            <h3 className="rc-panel-heading">Selected Resource</h3>
            <div className="rc-resource-card">
              <div className="rc-resource-card-icon"><MonitorIcon /></div>
              <div>
                <p className="rc-resource-card-name">{resource}</p>
                <p className="rc-resource-card-type">{details.type}</p>
              </div>
            </div>

            <h3 className="rc-panel-heading rc-panel-heading--mt">Resource Details</h3>
            <table className="rc-details-table">
              <tbody>
                <tr>
                  <td className="rc-detail-key">Capacity</td>
                  <td className="rc-detail-val">{details.capacity}</td>
                </tr>
                <tr>
                  <td className="rc-detail-key">Location</td>
                  <td className="rc-detail-val">{details.location}</td>
                </tr>
                <tr>
                  <td className="rc-detail-key">Type</td>
                  <td className="rc-detail-val rc-detail-val--accent">{details.kind}</td>
                </tr>
                <tr>
                  <td className="rc-detail-key">Amenities</td>
                  <td className="rc-detail-val">{details.amenities}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="rc-panel-heading rc-panel-heading--mt">Legend</h3>
            <div className="rc-legend">
              <div className="rc-legend-item">
                <span className="rc-legend-dot rc-legend-dot--available" />
                <div>
                  <p className="rc-legend-label">Available</p>
                  <p className="rc-legend-desc">Time slot is available</p>
                </div>
              </div>
              <div className="rc-legend-item">
                <span className="rc-legend-dot rc-legend-dot--booked" />
                <div>
                  <p className="rc-legend-label">Booked</p>
                  <p className="rc-legend-desc">Time slot is already booked</p>
                </div>
              </div>
              <div className="rc-legend-item">
                <span className="rc-legend-dot rc-legend-dot--pending" />
                <div>
                  <p className="rc-legend-label">Pending</p>
                  <p className="rc-legend-desc">Awaiting approval</p>
                </div>
              </div>
            </div>

            <div className="rc-info-box">
              <span className="rc-info-icon"><InfoIcon /></span>
              <p className="rc-info-text">Click on any time slot to make a booking request.</p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════ */
function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
      <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
      <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
      <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}
function BookingNavIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function RequestsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="12 8 12 12 14 14"/>
      <path d="M3.05 11a9 9 0 109.95-8.95"/>
      <polyline points="3 4 3 11 10 11"/>
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="8" x2="12" y2="8"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  );
}