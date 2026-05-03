import React, { useState, useRef, useCallback } from "react";
import "./HodUploadTimetable.css";
import { useNavigate } from "react-router-dom";
// SheetJS loaded via CDN in index.html — window.XLSX is available globally

/* ─── Sidebar Nav ─────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard",        Icon: HomeIcon       },
  { label: "All Bookings",     Icon: BookingsIcon   },
  { label: "Upload Time Table",Icon: UploadNavIcon  },
  { label: "Resources",        Icon: ResourcesIcon  },
  { label: "Profile",          Icon: ProfileIcon    },
  { label: "Logout",           Icon: LogoutIcon     },
];

/* ─── Week Days ───────────────────────────────── */
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS= ["Mon",    "Tue",     "Wed",       "Thu",      "Fri",    "Sat"];

const HOURS = [
  "08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","01:00 PM","02:00 PM","03:00 PM",
  "04:00 PM","05:00 PM","06:00 PM",
];

/* ─── Colour palette for subjects ────────────── */
const SLOT_COLORS = [
  { bg: "#fee2e2", border: "#dc2626", text: "#991b1b" },
  { bg: "#dbeafe", border: "#2563eb", text: "#1e40af" },
  { bg: "#dcfce7", border: "#16a34a", text: "#14532d" },
  { bg: "#fef9c3", border: "#ca8a04", text: "#854d0e" },
  { bg: "#f3e8ff", border: "#9333ea", text: "#581c87" },
  { bg: "#ffedd5", border: "#ea580c", text: "#9a3412" },
  { bg: "#cffafe", border: "#0891b2", text: "#164e63" },
  { bg: "#fce7f3", border: "#db2777", text: "#831843" },
];

const subjectColorMap = {};
let colorIdx = 0;
function getSubjectColor(subject) {
  if (!subjectColorMap[subject]) {
    subjectColorMap[subject] = SLOT_COLORS[colorIdx % SLOT_COLORS.length];
    colorIdx++;
  }
  return subjectColorMap[subject];
}

/* ─── Sample / Template data ──────────────────── */
const SAMPLE_DATA = [
  { Day:"Monday",    Subject:"Data Structures",    Faculty:"Dr. Emily Davis",   StartTime:"10:00 AM", EndTime:"12:00 PM", Resource:"Computer Lab 1"  },
  { Day:"Monday",    Subject:"Operating Systems",  Faculty:"Prof. John Smith",  StartTime:"02:00 PM", EndTime:"04:00 PM", Resource:"Smart Classroom 1"},
  { Day:"Tuesday",   Subject:"DBMS",               Faculty:"Dr. Sarah Wilson",  StartTime:"09:00 AM", EndTime:"11:00 AM", Resource:"Seminar Hall"     },
  { Day:"Tuesday",   Subject:"Computer Networks",  Faculty:"Dr. Raj Patel",     StartTime:"01:00 PM", EndTime:"03:00 PM", Resource:"Computer Lab 1"  },
  { Day:"Wednesday", Subject:"Data Structures",    Faculty:"Dr. Emily Davis",   StartTime:"10:00 AM", EndTime:"12:00 PM", Resource:"Computer Lab 1"  },
  { Day:"Wednesday", Subject:"Algorithms",         Faculty:"Prof. Anita Roy",   StartTime:"03:00 PM", EndTime:"05:00 PM", Resource:"Smart Classroom 1"},
  { Day:"Thursday",  Subject:"DBMS",               Faculty:"Dr. Sarah Wilson",  StartTime:"11:00 AM", EndTime:"01:00 PM", Resource:"Seminar Hall"     },
  { Day:"Thursday",  Subject:"Operating Systems",  Faculty:"Prof. John Smith",  StartTime:"02:00 PM", EndTime:"04:00 PM", Resource:"Smart Classroom 1"},
  { Day:"Friday",    Subject:"Computer Networks",  Faculty:"Dr. Raj Patel",     StartTime:"09:00 AM", EndTime:"11:00 AM", Resource:"Computer Lab 1"  },
  { Day:"Friday",    Subject:"Algorithms",         Faculty:"Prof. Anita Roy",   StartTime:"12:00 PM", EndTime:"02:00 PM", Resource:"Physics Lab"      },
  { Day:"Saturday",  Subject:"Project Work",       Faculty:"Dr. David Lee",     StartTime:"10:00 AM", EndTime:"01:00 PM", Resource:"Seminar Hall"     },
];

/* ─── Time helpers ────────────────────────────── */
function timeToH(t) {
  if (!t) return 0;
  const s   = String(t).trim().toUpperCase();
  const pm  = s.includes("PM");
  const am  = s.includes("AM");
  const raw = s.replace("AM","").replace("PM","").trim();
  let [h, m] = raw.split(":").map(Number);
  if (isNaN(m)) m = 0;
  if (pm && h !== 12) h += 12;
  if (am && h === 12) h = 0;
  return h + m / 60;
}

const BASE_H     = 8;
const HOUR_PX    = 68;

function slotStyle(start, end) {
  const sh = timeToH(start);
  const eh = timeToH(end);
  const top    = (sh - BASE_H) * HOUR_PX;
  const height = Math.max((eh - sh) * HOUR_PX - 4, 30);
  return { top: `${top}px`, height: `${height}px` };
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HodUploadTimetable() {
  const navigate    = useNavigate();
  const fileRef     = useRef();
  const [activeNav, setActiveNav]   = useState("Upload Time Table");
  const [dragging,  setDragging]    = useState(false);
  const [file,      setFile]        = useState(null);
  const [slots,     setSlots]       = useState([]);
  const [uploaded,  setUploaded]    = useState(false);
  const [parsing,   setParsing]     = useState(false);
  const [error,     setError]       = useState("");
  const [toast,     setToast]       = useState(null);
  const [activeDay, setActiveDay]   = useState("All");
  const [history,   setHistory]     = useState([]);

  /* ── Nav ── */
  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Logout")           navigate("/login");
    if (label === "Dashboard")        navigate("/hod-dashboard");
    if (label === "All Bookings")     navigate("/hod-all-bookings");
    if (label === "Resources")        navigate("/hod-resources");
    if (label === "Upload Time Table") navigate("/hod-upload-timetable");
  };

  /* ── Toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Normalize a row object → standard slot shape ── */
  const normalizeRow = (norm) => ({
    Day:       String(norm["Day"]       || norm["day"]       || "").trim(),
    Subject:   String(norm["Subject"]   || norm["subject"]   || norm["Course"]  || "").trim(),
    Faculty:   String(norm["Faculty"]   || norm["faculty"]   || norm["Teacher"] || "").trim(),
    StartTime: String(norm["StartTime"] || norm["Start Time"]|| norm["start"]   || "").trim(),
    EndTime:   String(norm["EndTime"]   || norm["End Time"]  || norm["end"]     || "").trim(),
    Resource:  String(norm["Resource"]  || norm["resource"]  || norm["Room"]    || "").trim(),
  });

  /* ── Simple CSV text → array of objects ── */
  const parseCSVText = (text) => {
    const lines   = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
    return lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.replace(/"/g, "").trim());
      const obj  = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
      return obj;
    });
  };

  /* ── Main parse dispatcher ── */
  const parseFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setError("Please upload a valid Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    setError("");
    setParsing(true);

    const finish = (rows) => {
      const normalized = rows.map(normalizeRow)
        .filter(r => r.Day && r.Subject && r.StartTime && r.EndTime);

      if (normalized.length === 0) {
        setError("No valid rows found. Make sure columns are: Day, Subject, Faculty, StartTime, EndTime, Resource.");
        setParsing(false);
        return;
      }
      setSlots(normalized);
      setFile(f);
      setUploaded(true);
      setHistory(prev => [{
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB",
        rows: normalized.length,
        time: new Date().toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }),
      }, ...prev.slice(0, 4)]);
      setParsing(false);
      showToast(`✓ Timetable loaded — ${normalized.length} slots found.`);
    };

    if (ext === "csv") {
      /* ── CSV: use built-in FileReader, zero dependencies ── */
      const reader = new FileReader();
      reader.onload = (e) => {
        try { finish(parseCSVText(e.target.result)); }
        catch { setError("Failed to parse CSV. Check the format."); setParsing(false); }
      };
      reader.readAsText(f);
    } else {
      /* ── XLSX / XLS: use read-excel-file (no vulnerabilities) ── */
      readXlsxFile(f)
        .then((rows) => {
          if (!rows || rows.length < 2) {
            setError("File appears empty. Add a header row + at least one data row.");
            setParsing(false);
            return;
          }
          const headers = rows[0].map(h => String(h ?? "").trim());
          const objects = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((h, i) => { obj[h] = row[i] != null ? String(row[i]) : ""; });
            return obj;
          });
          finish(objects);
        })
        .catch(() => {
          setError("Failed to read Excel file. Make sure it is a valid .xlsx or .xls file.");
          setParsing(false);
        });
    }
  };

  /* ── Drag & Drop ── */
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) parseFile(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = ()  => setDragging(false);
  const onFileChange = (e) => { if (e.target.files[0]) parseFile(e.target.files[0]); };

  /* ── Download template as CSV (zero dependencies) ── */
  const downloadTemplate = () => {
    const headers = ["Day","Subject","Faculty","StartTime","EndTime","Resource"];
    const rows    = SAMPLE_DATA.map(r =>
      headers.map(h => `"${r[h] ?? ""}"`).join(",")
    );
    const csv  = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "Timetable_Template.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Template downloaded!");
  };

  /* ── Load sample ── */
  const loadSample = () => {
    setSlots(SAMPLE_DATA);
    setUploaded(true);
    setFile({ name: "Sample_Timetable.xlsx" });
    showToast("Sample timetable loaded for preview.");
  };

  /* ── Clear ── */
  const clearAll = () => {
    setSlots([]); setUploaded(false); setFile(null); setError("");
    setActiveDay("All");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Filtered slots ── */
  const visibleDays  = activeDay === "All" ? WEEK_DAYS : [activeDay];
  const filteredSlots = (day) => slots.filter(s =>
    s.Day.toLowerCase() === day.toLowerCase()
  );

  /* ── Stats ── */
  const uniqueFaculty   = [...new Set(slots.map(s => s.Faculty))].length;
  const uniqueSubjects  = [...new Set(slots.map(s => s.Subject))].length;
  const uniqueResources = [...new Set(slots.map(s => s.Resource))].length;

  /* ═══ RENDER ═══ */
  return (
    <div className="tt-root">

      {/* ── Sidebar ── */}
      <aside className="tt-sidebar">
        <div className="tt-brand">
          <span className="tt-brand-icon"><GridIcon /></span>
          <span className="tt-brand-text">Resource Allocation<br />System</span>
        </div>
        <nav className="tt-nav">
          {NAV_ITEMS.map(({ label, Icon }) => (
            <button
              key={label}
              className={`tt-nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => handleNav(label)}
            >
              <span className="tt-nav-icon"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="tt-main">

        {/* Header */}
        <header className="tt-header">
          <div>
            <h1 className="tt-title">Upload Time Table</h1>
            <p className="tt-subtitle">Upload your department timetable in Excel format to auto-populate class slots.</p>
          </div>
          <div className="tt-header-right">
            <button className="tt-notif-btn">
              <BellIcon />
              <span className="tt-notif-badge">3</span>
            </button>
            <div className="tt-user-chip">
              <div className="tt-avatar">M</div>
              <div className="tt-user-text">
                <span className="tt-user-name">Dr. Michael Brown</span>
                <span className="tt-user-role">HOD – CSE Department</span>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="tt-content">

          {/* ── Top row: Upload zone + Info panel ── */}
          <div className="tt-top-row">

            {/* Upload zone */}
            <div className="tt-upload-card">
              <div className="tt-upload-card-header">
                <div className="tt-upload-card-icon"><ExcelIcon /></div>
                <div>
                  <h2 className="tt-upload-card-title">Upload Excel Timetable</h2>
                  <p className="tt-upload-card-sub">Supports .xlsx, .xls, .csv formats</p>
                </div>
              </div>

              {/* Drop zone */}
              <div
                className={`tt-dropzone ${dragging ? "tt-dropzone--drag" : ""} ${uploaded ? "tt-dropzone--done" : ""}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => !uploaded && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="tt-file-input"
                  onChange={onFileChange}
                />

                {parsing ? (
                  <div className="tt-parsing-state">
                    <div className="tt-spinner" />
                    <p className="tt-dz-title">Parsing your file…</p>
                  </div>
                ) : uploaded ? (
                  <div className="tt-done-state">
                    <div className="tt-done-icon"><CheckCircleIcon /></div>
                    <p className="tt-dz-title">{file?.name}</p>
                    <p className="tt-dz-sub">{slots.length} class slots loaded successfully</p>
                    <button className="tt-replace-btn" onClick={(e) => { e.stopPropagation(); clearAll(); }}>
                      <RefreshIcon /> Replace File
                    </button>
                  </div>
                ) : (
                  <div className="tt-idle-state">
                    <div className="tt-dz-icon"><UploadCloudIcon /></div>
                    <p className="tt-dz-title">Drag & drop your Excel file here</p>
                    <p className="tt-dz-sub">or click to browse from your computer</p>
                    <button className="tt-browse-btn" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                      <FolderIcon /> Browse File
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="tt-error-box">
                  <WarnIcon /> {error}
                </div>
              )}

              {/* Actions */}
              <div className="tt-upload-actions">
                <button className="tt-template-btn" onClick={downloadTemplate}>
                  <DownloadIcon /> Download Template
                </button>
                {!uploaded && (
                  <button className="tt-sample-btn" onClick={loadSample}>
                    <EyeIcon /> Load Sample
                  </button>
                )}
              </div>

              {/* Format guide */}
              <div className="tt-format-guide">
                <p className="tt-format-title"><InfoIcon /> Required Excel Columns</p>
                <div className="tt-format-cols">
                  {["Day","Subject","Faculty","StartTime","EndTime","Resource"].map(c => (
                    <span key={c} className="tt-format-col">{c}</span>
                  ))}
                </div>
                <p className="tt-format-example">
                  Example row: <em>Monday · Data Structures · Dr. Emily Davis · 10:00 AM · 12:00 PM · Computer Lab 1</em>
                </p>
              </div>
            </div>

            {/* Right panel */}
            <div className="tt-right-col">

              {/* Stats (show after upload) */}
              {uploaded && (
                <div className="tt-stats-grid">
                  <div className="tt-stat-mini tt-stat-mini--blue">
                    <span className="tt-stat-mini-val">{slots.length}</span>
                    <span className="tt-stat-mini-label">Total Slots</span>
                  </div>
                  <div className="tt-stat-mini tt-stat-mini--green">
                    <span className="tt-stat-mini-val">{uniqueSubjects}</span>
                    <span className="tt-stat-mini-label">Subjects</span>
                  </div>
                  <div className="tt-stat-mini tt-stat-mini--purple">
                    <span className="tt-stat-mini-val">{uniqueFaculty}</span>
                    <span className="tt-stat-mini-label">Faculty</span>
                  </div>
                  <div className="tt-stat-mini tt-stat-mini--orange">
                    <span className="tt-stat-mini-val">{uniqueResources}</span>
                    <span className="tt-stat-mini-label">Resources</span>
                  </div>
                </div>
              )}

              {/* Upload history */}
              <div className="tt-history-card">
                <h3 className="tt-history-title">
                  <HistoryIcon /> Upload History
                </h3>
                {history.length === 0 ? (
                  <div className="tt-history-empty">
                    <p>No uploads yet.</p>
                  </div>
                ) : (
                  <div className="tt-history-list">
                    {history.map((h, i) => (
                      <div key={i} className="tt-history-row">
                        <div className="tt-history-icon"><ExcelSmallIcon /></div>
                        <div className="tt-history-info">
                          <p className="tt-history-name">{h.name}</p>
                          <p className="tt-history-meta">{h.rows} rows · {h.size}</p>
                        </div>
                        <div className="tt-history-time">{h.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Legend */}
              {uploaded && (
                <div className="tt-legend-card">
                  <h3 className="tt-legend-title">Subjects</h3>
                  <div className="tt-legend-list">
                    {[...new Set(slots.map(s => s.Subject))].map(sub => {
                      const c = getSubjectColor(sub);
                      return (
                        <div key={sub} className="tt-legend-item">
                          <span className="tt-legend-dot" style={{ background: c.border }} />
                          <span className="tt-legend-label">{sub}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Timetable Calendar View ── */}
          {uploaded && slots.length > 0 && (
            <div className="tt-calendar-card">
              <div className="tt-cal-header">
                <div>
                  <h2 className="tt-cal-title">Weekly Timetable View</h2>
                  <p className="tt-cal-sub">Class slots auto-populated from your uploaded file.</p>
                </div>
                <div className="tt-day-tabs">
                  <button
                    className={`tt-day-tab ${activeDay === "All" ? "active" : ""}`}
                    onClick={() => setActiveDay("All")}
                  >All Days</button>
                  {WEEK_DAYS.map((d, i) => (
                    <button
                      key={d}
                      className={`tt-day-tab ${activeDay === d ? "active" : ""}`}
                      onClick={() => setActiveDay(d)}
                    >
                      {SHORT_DAYS[i]}
                      {filteredSlots(d).length > 0 && (
                        <span className="tt-day-tab-dot" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="tt-grid-wrap">

                {/* Column headers */}
                <div className="tt-col-headers">
                  <div className="tt-time-spacer" />
                  {visibleDays.map((d, i) => (
                    <div key={d} className="tt-col-head">
                      <span className="tt-col-head-day">{SHORT_DAYS[WEEK_DAYS.indexOf(d)]}</span>
                      <span className="tt-col-head-full">{d}</span>
                      <span className="tt-col-head-count">
                        {filteredSlots(d).length} {filteredSlots(d).length === 1 ? "class" : "classes"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Scrollable body */}
                <div className="tt-grid-scroll">
                  <div className="tt-grid-inner" style={{ minHeight: `${HOURS.length * HOUR_PX}px` }}>

                    {/* Time labels */}
                    <div className="tt-time-col">
                      {HOURS.map(h => (
                        <div key={h} className="tt-time-cell" style={{ height: `${HOUR_PX}px` }}>
                          <span className="tt-time-label">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Day columns */}
                    {visibleDays.map(day => (
                      <div key={day} className="tt-day-col">
                        {/* Hour lines */}
                        {HOURS.map((_, idx) => (
                          <div key={idx} className="tt-hour-line" style={{ top: `${idx * HOUR_PX}px` }} />
                        ))}
                        {/* Slots */}
                        {filteredSlots(day).map((slot, i) => {
                          const c = getSubjectColor(slot.Subject);
                          return (
                            <div
                              key={i}
                              className="tt-slot"
                              style={{
                                ...slotStyle(slot.StartTime, slot.EndTime),
                                background: c.bg,
                                borderLeft: `4px solid ${c.border}`,
                              }}
                            >
                              <p className="tt-slot-time" style={{ color: c.border }}>
                                {slot.StartTime} – {slot.EndTime}
                              </p>
                              <p className="tt-slot-subject" style={{ color: c.text }}>
                                {slot.Subject}
                              </p>
                              {slot.Faculty && (
                                <p className="tt-slot-faculty" style={{ color: c.text }}>
                                  {slot.Faculty}
                                </p>
                              )}
                              {slot.Resource && (
                                <p className="tt-slot-resource" style={{ color: c.border }}>
                                  <RoomIcon /> {slot.Resource}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Table below grid */}
              <div className="tt-table-section">
                <h3 className="tt-table-section-title">Raw Slot Data</h3>
                <div className="tt-table-wrap">
                  <table className="tt-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Day</th>
                        <th>Subject</th>
                        <th>Faculty</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Resource</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeDay === "All" ? slots : slots.filter(s => s.Day === activeDay)).map((s, i) => {
                        const c = getSubjectColor(s.Subject);
                        return (
                          <tr key={i} className="tt-tr">
                            <td className="tt-td-num">{i + 1}</td>
                            <td><span className="tt-td-day">{s.Day}</span></td>
                            <td>
                              <span className="tt-subject-tag" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                                {s.Subject}
                              </span>
                            </td>
                            <td className="tt-td-faculty">{s.Faculty}</td>
                            <td className="tt-td-time">{s.StartTime}</td>
                            <td className="tt-td-time">{s.EndTime}</td>
                            <td className="tt-td-resource">{s.Resource}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`tt-toast tt-toast--${toast.type}`}>
          {toast.type === "success" ? <CheckSmIcon /> : <WarnIcon />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */
function GridIcon()        { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/></svg>; }
function HomeIcon()        { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>; }
function BookingsIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UploadNavIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function ResourcesIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function ProfileIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }
function LogoutIcon()      { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function BellIcon()        { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>; }
function ChevronDownIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>; }
function UploadCloudIcon() { return <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>; }
function FolderIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>; }
function CheckCircleIcon() { return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>; }
function RefreshIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>; }
function DownloadIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function EyeIcon()         { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function InfoIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="12" x2="12" y2="16"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>; }
function WarnIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>; }
function ExcelIcon()       { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#16a34a"/><path d="M8 8l3 4-3 4M16 8l-3 4 3 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="12" x2="13" y2="12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function ExcelSmallIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" fill="#16a34a"/><path d="M8 8l3 4-3 4M16 8l-3 4 3 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>; }
function HistoryIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 109.95-8.95"/><polyline points="3 4 3 11 10 11"/></svg>; }
function CheckSmIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>; }
function RoomIcon()        { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }