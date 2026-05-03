import React, { useState, useMemo } from "react";
import "./HodAllBookings.css";
import { useNavigate } from "react-router-dom";
import { TimerIcon } from "lucide-react";

/* ─── Nav ─────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard",        Icon: HomeIcon       },
  // { label: "Booking Requests", Icon: RequestsIcon   },
  { label: "All Bookings",     Icon: BookingsIcon   },
  { label : "Upload Time Table" ,  Icon : UploadNavIcon } , 
  { label: "Resources",        Icon: ResourcesIcon  },
  // { label: "Reports",          Icon: ReportsIcon    },
  { label: "Profile",          Icon: ProfileIcon    },
  { label: "Logout",           Icon: LogoutIcon     },
];

/* ─── All Bookings Data ───────────────────────── */
const ALL_BOOKINGS = [
  { id: "#BK001", resource: "Computer Lab 1",  type: "Lab",       faculty: "Dr. Emily Davis",   dept: "CSE", date: "26 May 2025", time: "10:00 AM – 12:00 PM", purpose: "Lab Session",          status: "Confirmed" },
  { id: "#BK002", resource: "Seminar Hall",     type: "Hall",      faculty: "Dr. Sarah Wilson",  dept: "ECE", date: "27 May 2025", time: "02:00 PM – 04:00 PM", purpose: "Guest Lecture on AI",  status: "Confirmed" },
  { id: "#BK003", resource: "Physics Lab",      type: "Lab",       faculty: "Dr. Raj Patel",     dept: "PHY", date: "28 May 2025", time: "09:00 AM – 11:00 AM", purpose: "Practical Exam Batch B",status: "Confirmed" },
  { id: "#BK004", resource: "Smart Classroom",  type: "Classroom", faculty: "Prof. John Smith",  dept: "CSE", date: "24 May 2025", time: "11:00 AM – 01:00 PM", purpose: "Online Presentation",  status: "Cancelled" },
  { id: "#BK005", resource: "Computer Lab 1",  type: "Lab",       faculty: "Prof. Anita Roy",   dept: "IT",  date: "30 May 2025", time: "10:00 AM – 12:00 PM", purpose: "Seminar Workshop",      status: "Pending"   },
  { id: "#BK006", resource: "Seminar Hall",     type: "Hall",      faculty: "Dr. David Lee",     dept: "MBA", date: "29 May 2025", time: "08:00 AM – 10:00 AM", purpose: "Department Meeting",   status: "Confirmed" },
  { id: "#BK007", resource: "Smart Classroom",  type: "Classroom", faculty: "Dr. Emily Davis",   dept: "CSE", date: "31 May 2025", time: "03:00 PM – 05:00 PM", purpose: "Project Review",       status: "Pending"   },
  { id: "#BK008", resource: "Physics Lab",      type: "Lab",       faculty: "Dr. Meera Shah",    dept: "PHY", date: "01 Jun 2025", time: "10:00 AM – 12:00 PM", purpose: "Experiment Session",   status: "Confirmed" },
  { id: "#BK009", resource: "Computer Lab 1",  type: "Lab",       faculty: "Prof. Rahul Das",   dept: "IT",  date: "02 Jun 2025", time: "01:00 PM – 03:00 PM", purpose: "Coding Bootcamp",      status: "Cancelled" },
  { id: "#BK010", resource: "Seminar Hall",     type: "Hall",      faculty: "Dr. Sarah Wilson",  dept: "ECE", date: "03 Jun 2025", time: "11:00 AM – 01:00 PM", purpose: "Research Presentation",status: "Pending"   },
  { id: "#BK011", resource: "Smart Classroom",  type: "Classroom", faculty: "Dr. Raj Patel",     dept: "PHY", date: "04 Jun 2025", time: "09:00 AM – 11:00 AM", purpose: "Tutorial Class",       status: "Confirmed" },
  { id: "#BK012", resource: "Physics Lab",      type: "Lab",       faculty: "Prof. John Smith",  dept: "CSE", date: "05 Jun 2025", time: "02:00 PM – 04:00 PM", purpose: "Lab Demo",             status: "Confirmed" },
];

const STATUSES = ["All", "Confirmed", "Pending", "Cancelled"];
const RESOURCES = ["All Resources", "Computer Lab 1", "Seminar Hall", "Physics Lab", "Smart Classroom"];
const DEPARTMENTS = ["All Departments", "CSE", "ECE", "IT", "PHY", "MBA"];

const ROWS_PER_PAGE = 8;

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HodAllBookings() {
  const navigate = useNavigate();
  const [activeNav,    setActiveNav]    = useState("All Bookings");
  const [activeTab,    setActiveTab]    = useState("All");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [filterRes,    setFilterRes]    = useState("All Resources");
  const [filterDept,   setFilterDept]   = useState("All Departments");
  const [sortField,    setSortField]    = useState("date");
  const [sortDir,      setSortDir]      = useState("asc");
  const [page,         setPage]         = useState(1);
  const [bookings,     setBookings]     = useState(ALL_BOOKINGS);
  const [toast,        setToast]        = useState(null);
  const [detailRow,    setDetailRow]    = useState(null);

  /* ── Stats ── */
  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending:   bookings.filter(b => b.status === "Pending").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  /* ── Filter + Search + Sort ── */
  const filtered = useMemo(() => {
    let data = [...bookings];
    if (activeTab !== "All") data = data.filter(b => b.status === activeTab);
    if (filterRes  !== "All Resources")   data = data.filter(b => b.resource === filterRes);
    if (filterDept !== "All Departments") data = data.filter(b => b.dept === filterDept);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(b =>
        b.id.toLowerCase().includes(q)        ||
        b.resource.toLowerCase().includes(q)  ||
        b.faculty.toLowerCase().includes(q)   ||
        b.purpose.toLowerCase().includes(q)   ||
        b.dept.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      let valA = a[sortField] ?? "";
      let valB = b[sortField] ?? "";
      return sortDir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return data;
  }, [bookings, activeTab, filterRes, filterDept, searchQuery, sortField, sortDir]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  /* ── Sort toggle ── */
  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  /* ── Tab change resets page ── */
  const handleTab = (tab) => { setActiveTab(tab); setPage(1); };

  /* ── Cancel booking ── */
  const handleCancel = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
    setDetailRow(null);
    showToast(`Booking ${id} cancelled.`, "error");
  };

  /* ── Toast ── */
  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Nav ── */
  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Logout")    navigate("/login");
    if (label === "Dashboard") navigate("/hod-dashboard");
    if (label === "Booking Requests") navigate("/hod-booking-requests");
    if (label == "Resources") navigate("/hod-resources");
    if (label == "Upload Time Table") navigate("/hod-upload-timetable");
  };

  /* ── Sort icon ── */
  const SortIcon = ({ field }) => (
    <span className={`ab-sort-icon ${sortField === field ? "ab-sort-icon--active" : ""}`}>
      {sortField === field && sortDir === "desc" ? <SortDescIcon /> : <SortAscIcon />}
    </span>
  );

  /* ═══ RENDER ═══ */
  return (
    <div className="ab-root">

      {/* ── Sidebar ── */}
      <aside className="ab-sidebar">
        <div className="ab-brand">
          <span className="ab-brand-icon"><GridIcon /></span>
          <span className="ab-brand-text">Resource Allocation<br />System</span>
        </div>
        <nav className="ab-nav">
          {NAV_ITEMS.map(({ label, Icon }) => (
            <button
              key={label}
              className={`ab-nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => handleNav(label)}
            >
              <span className="ab-nav-icon"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="ab-main">

        {/* Header */}
        <header className="ab-header">
          <div>
            <h1 className="ab-title">All Bookings</h1>
            <p className="ab-subtitle">Complete view of all resource bookings across the department.</p>
          </div>
          <div className="ab-header-right">
            <button className="ab-notif-btn">
              <BellIcon />
              <span className="ab-notif-badge">3</span>
            </button>
            <div className="ab-user-chip">
              <div className="ab-avatar">M</div>
              <div className="ab-user-text">
                <span className="ab-user-name">Dr. Michael Brown</span>
                <span className="ab-user-role">HOD – CSE Department</span>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="ab-content">

          {/* ── Stats ── */}
          <div className="ab-stats">
            {[
              { label: "Total Bookings", value: stats.total,     color: "blue",   Icon: TotalIcon    },
              { label: "Confirmed",      value: stats.confirmed, color: "green",  Icon: ConfirmIcon  },
              { label: "Pending",        value: stats.pending,   color: "orange", Icon: PendingIcon  },
              { label: "Cancelled",      value: stats.cancelled, color: "red",    Icon: CancelIcon   },
            ].map(({ label, value, color, Icon: Ic }) => (
              <div key={label} className="ab-stat">
                <div className={`ab-stat-icon ab-stat-icon--${color}`}><Ic /></div>
                <div>
                  <p className="ab-stat-value">{value}</p>
                  <p className="ab-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Table Card ── */}
          <div className="ab-table-card">

            {/* Toolbar */}
            <div className="ab-toolbar">
              {/* Tabs */}
              <div className="ab-tabs">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`ab-tab ${activeTab === s ? "active" : ""}`}
                    onClick={() => handleTab(s)}
                  >
                    {s}
                    <span className="ab-tab-count">
                      {s === "All" ? bookings.length : bookings.filter(b => b.status === s).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right filters */}
              <div className="ab-filters">
                {/* Search */}
                <div className="ab-search-wrap">
                  <SearchIcon />
                  <input
                    className="ab-search"
                    placeholder="Search bookings…"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                  />
                  {searchQuery && (
                    <button className="ab-search-clear" onClick={() => { setSearchQuery(""); setPage(1); }}>
                      <XSmallIcon />
                    </button>
                  )}
                </div>

                {/* Resource filter */}
                <select
                  className="ab-filter-select"
                  value={filterRes}
                  onChange={e => { setFilterRes(e.target.value); setPage(1); }}
                >
                  {RESOURCES.map(r => <option key={r}>{r}</option>)}
                </select>

                {/* Dept filter */}
                <select
                  className="ab-filter-select"
                  value={filterDept}
                  onChange={e => { setFilterDept(e.target.value); setPage(1); }}
                >
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Results summary */}
            <div className="ab-results-bar">
              <span className="ab-results-text">
                Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> bookings
              </span>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
              <div className="ab-empty">
                <EmptyIcon />
                <p>No bookings match your current filters.</p>
                <button className="ab-reset-btn" onClick={() => {
                  setActiveTab("All"); setSearchQuery(""); setFilterRes("All Resources"); setFilterDept("All Departments"); setPage(1);
                }}>Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="ab-table-wrap">
                  <table className="ab-table">
                    <thead>
                      <tr>
                        {[
                          { key: "id",       label: "ID"           },
                          { key: "resource", label: "Resource"     },
                          { key: "faculty",  label: "Faculty"      },
                          { key: "dept",     label: "Dept"         },
                          { key: "date",     label: "Date"         },
                          { key: "time",     label: "Time"         },
                          { key: "purpose",  label: "Purpose"      },
                          { key: "status",   label: "Status"       },
                        ].map(col => (
                          <th key={col.key} onClick={() => handleSort(col.key)} className="ab-th">
                            {col.label} <SortIcon field={col.key} />
                          </th>
                        ))}
                        <th className="ab-th">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map(b => (
                        <tr
                          key={b.id}
                          className="ab-tr"
                          onClick={() => setDetailRow(b)}
                        >
                          <td><span className="ab-id">{b.id}</span></td>
                          <td>
                            <div className="ab-resource-cell">
                              <span className={`ab-res-dot ab-res-dot--${b.type.toLowerCase()}`} />
                              <span className="ab-resource-name">{b.resource}</span>
                            </div>
                          </td>
                          <td><span className="ab-faculty">{b.faculty}</span></td>
                          <td><span className="ab-dept-tag">{b.dept}</span></td>
                          <td><span className="ab-date">{b.date}</span></td>
                          <td><span className="ab-time">{b.time}</span></td>
                          <td><span className="ab-purpose" title={b.purpose}>{b.purpose}</span></td>
                          <td>
                            <span className={`ab-badge ab-badge--${b.status.toLowerCase()}`}>
                              {b.status === "Confirmed" && <CheckIcon />}
                              {b.status === "Pending"   && <ClockIcon />}
                              {b.status === "Cancelled" && <XSmallIcon />}
                              {b.status}
                            </span>
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            {b.status !== "Cancelled" ? (
                              <button
                                className="ab-cancel-btn"
                                onClick={() => handleCancel(b.id)}
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="ab-action-none">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="ab-pagination">
                  <span className="ab-page-info">Page {page} of {totalPages}</span>
                  <div className="ab-page-btns">
                    <button
                      className="ab-page-btn"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeftIcon />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        className={`ab-page-num ${page === n ? "active" : ""}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className="ab-page-btn"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {detailRow && (
        <div className="ab-overlay" onClick={() => setDetailRow(null)}>
          <div className="ab-drawer" onClick={e => e.stopPropagation()}>
            <div className="ab-drawer-header">
              <div>
                <h2 className="ab-drawer-title">Booking Details</h2>
                <p className="ab-drawer-id">{detailRow.id}</p>
              </div>
              <button className="ab-drawer-close" onClick={() => setDetailRow(null)}>
                <XSmallIcon />
              </button>
            </div>

            <div className="ab-drawer-body">
              <span className={`ab-badge ab-badge--${detailRow.status.toLowerCase()} ab-badge--lg`}>
                {detailRow.status === "Confirmed" && <CheckIcon />}
                {detailRow.status === "Pending"   && <ClockIcon />}
                {detailRow.status === "Cancelled" && <XSmallIcon />}
                {detailRow.status}
              </span>

              <div className="ab-drawer-grid">
                {[
                  { label: "Resource",    value: detailRow.resource  },
                  { label: "Type",        value: detailRow.type      },
                  { label: "Faculty",     value: detailRow.faculty   },
                  { label: "Department",  value: detailRow.dept      },
                  { label: "Date",        value: detailRow.date      },
                  { label: "Time",        value: detailRow.time      },
                  { label: "Purpose",     value: detailRow.purpose   },
                ].map(({ label, value }) => (
                  <div key={label} className="ab-drawer-row">
                    <span className="ab-drawer-key">{label}</span>
                    <span className="ab-drawer-val">{value}</span>
                  </div>
                ))}
              </div>

              {detailRow.status !== "Cancelled" && (
                <button
                  className="ab-drawer-cancel"
                  onClick={() => handleCancel(detailRow.id)}
                >
                  Cancel This Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`ab-toast ab-toast--${toast.type}`}>
          {toast.type === "success" ? <CheckIcon /> : <XSmallIcon />}
          {toast.msg}
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */
function GridIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/></svg>; }
function HomeIcon()      { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>; }
function UploadNavIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function RequestsIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function BookingsIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function ResourcesIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function ReportsIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function ProfileIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }
function LogoutIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function BellIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>; }
function ChevronDownIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>; }
function ChevronLeftIcon(){ return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevronRightIcon(){ return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>; }
function SearchIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>; }
function CheckIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>; }
function ClockIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>; }
function XSmallIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function SortAscIcon()   { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 3 18 9"/><line x1="12" y1="3" x2="12" y2="21"/></svg>; }
function SortDescIcon()  { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 15 12 21 18 15"/><line x1="12" y1="21" x2="12" y2="3"/></svg>; }
function EmptyIcon()     { return <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function TotalIcon()     { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function ConfirmIcon()   { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>; }
function PendingIcon()   { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>; }
function CancelIcon()    { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }