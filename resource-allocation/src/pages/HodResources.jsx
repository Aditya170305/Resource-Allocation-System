import React, { useState, useMemo } from "react";
import "./HodResources.css";
import { useNavigate } from "react-router-dom";

/* ─── Nav ─────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard",        Icon: HomeIcon      },
  { label: "Booking Requests", Icon: RequestsIcon  },
  { label: "All Bookings",     Icon: BookingsIcon  },
  { label: "Resources",        Icon: ResourcesIcon },
  { label: "Reports",          Icon: ReportsIcon   },
  { label: "Profile",          Icon: ProfileIcon   },
  { label: "Logout",           Icon: LogoutIcon    },
];

/* ─── Resources Data ──────────────────────────── */
const INIT_RESOURCES = [
  {
    id: "R001", name: "Computer Lab 1",   type: "Lab",       building: "Block A",
    floor: "Level 2", capacity: 40, status: "Available",
    amenities: ["Wi-Fi", "Projector", "AC", "40 PCs"],
    bookingsThisMonth: 12, utilization: 78,
    maintainedBy: "IT Dept", lastServiced: "10 May 2025",
  },
  {
    id: "R002", name: "Computer Lab 2",   type: "Lab",       building: "Block A",
    floor: "Level 3", capacity: 40, status: "Booked",
    amenities: ["Wi-Fi", "Projector", "AC", "40 PCs"],
    bookingsThisMonth: 9,  utilization: 62,
    maintainedBy: "IT Dept", lastServiced: "08 May 2025",
  },
  {
    id: "R003", name: "Seminar Hall",     type: "Hall",      building: "Block B",
    floor: "Level 1", capacity: 80, status: "Available",
    amenities: ["Wi-Fi", "Projector", "AC", "Mic System"],
    bookingsThisMonth: 7,  utilization: 45,
    maintainedBy: "Admin", lastServiced: "12 May 2025",
  },
  {
    id: "R004", name: "Physics Lab",      type: "Lab",       building: "Block C",
    floor: "Level 2", capacity: 30, status: "Under Maintenance",
    amenities: ["AC", "Lab Equipment", "Safety Kit"],
    bookingsThisMonth: 5,  utilization: 33,
    maintainedBy: "PHY Dept", lastServiced: "15 May 2025",
  },
  {
    id: "R005", name: "Smart Classroom 1",type: "Classroom", building: "Block A",
    floor: "Level 3", capacity: 60, status: "Available",
    amenities: ["Wi-Fi", "Smart Board", "AC", "Webcam"],
    bookingsThisMonth: 15, utilization: 88,
    maintainedBy: "IT Dept", lastServiced: "09 May 2025",
  },
  {
    id: "R006", name: "Smart Classroom 2",type: "Classroom", building: "Block A",
    floor: "Level 4", capacity: 60, status: "Booked",
    amenities: ["Wi-Fi", "Smart Board", "AC", "Webcam"],
    bookingsThisMonth: 11, utilization: 70,
    maintainedBy: "IT Dept", lastServiced: "07 May 2025",
  },
  {
    id: "R007", name: "Chemistry Lab",   type: "Lab",       building: "Block C",
    floor: "Level 1", capacity: 30, status: "Available",
    amenities: ["AC", "Fume Hood", "Lab Equipment", "Safety Kit"],
    bookingsThisMonth: 6,  utilization: 40,
    maintainedBy: "CHEM Dept", lastServiced: "11 May 2025",
  },
  {
    id: "R008", name: "Conference Room", type: "Hall",      building: "Block B",
    floor: "Level 2", capacity: 20, status: "Available",
    amenities: ["Wi-Fi", "Projector", "AC", "Video Conf"],
    bookingsThisMonth: 8,  utilization: 55,
    maintainedBy: "Admin", lastServiced: "13 May 2025",
  },
];

const TYPES    = ["All Types", "Lab", "Hall", "Classroom"];
const STATUSES = ["All Status", "Available", "Booked", "Under Maintenance"];
const VIEW_MODES = ["grid", "list"];

/* ─── Blank form ──────────────────────────────── */
const BLANK_FORM = {
  name: "", type: "Lab", building: "", floor: "",
  capacity: "", amenities: "", maintainedBy: "", status: "Available",
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function HodResources() {
  const navigate = useNavigate();
  const [activeNav,   setActiveNav]   = useState("Resources");
  const [resources,   setResources]   = useState(INIT_RESOURCES);
  const [viewMode,    setViewMode]    = useState("grid");
  const [filterType,  setFilterType]  = useState("All Types");
  const [filterStat,  setFilterStat]  = useState("All Status");
  const [searchQ,     setSearchQ]     = useState("");
  const [detailRes,   setDetailRes]   = useState(null);
  const [showAddModal,setShowAddModal]= useState(false);
  const [editRes,     setEditRes]     = useState(null);   // resource being edited
  const [form,        setForm]        = useState(BLANK_FORM);
  const [formError,   setFormError]   = useState("");
  const [toast,       setToast]       = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);

  /* ── Stats ── */
  const stats = {
    total:       resources.length,
    available:   resources.filter(r => r.status === "Available").length,
    booked:      resources.filter(r => r.status === "Booked").length,
    maintenance: resources.filter(r => r.status === "Under Maintenance").length,
  };

  /* ── Filter + Search ── */
  const filtered = useMemo(() => {
    let data = [...resources];
    if (filterType !== "All Types")   data = data.filter(r => r.type === filterType);
    if (filterStat !== "All Status")  data = data.filter(r => r.status === filterStat);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      data = data.filter(r =>
        r.name.toLowerCase().includes(q)     ||
        r.building.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)     ||
        r.id.toLowerCase().includes(q)
      );
    }
    return data;
  }, [resources, filterType, filterStat, searchQ]);

  /* ── Handlers ── */
  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Logout")           navigate("/login");
    if (label === "Dashboard")        navigate("/hod-dashboard");
    if (label === "All Bookings")     navigate("/hod-all-bookings");
    if (label === "Booking Requests") navigate("/hod-booking-requests");
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Add / Edit modal open */
  const openAdd = () => {
    setEditRes(null);
    setForm(BLANK_FORM);
    setFormError("");
    setShowAddModal(true);
  };
  const openEdit = (res) => {
    setEditRes(res);
    setForm({
      name: res.name, type: res.type, building: res.building,
      floor: res.floor, capacity: res.capacity,
      amenities: res.amenities.join(", "),
      maintainedBy: res.maintainedBy, status: res.status,
    });
    setFormError("");
    setShowAddModal(true);
    setDetailRes(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.building.trim() || !form.floor.trim() || !form.capacity) {
      setFormError("Please fill in all required fields.");
      return;
    }
    const amenitiesArr = form.amenities.split(",").map(a => a.trim()).filter(Boolean);
    if (editRes) {
      setResources(prev => prev.map(r => r.id === editRes.id
        ? { ...r, ...form, capacity: Number(form.capacity), amenities: amenitiesArr }
        : r
      ));
      showToast(`"${form.name}" updated successfully.`);
    } else {
      const newRes = {
        id: `R${String(resources.length + 1).padStart(3, "0")}`,
        ...form,
        capacity: Number(form.capacity),
        amenities: amenitiesArr,
        bookingsThisMonth: 0,
        utilization: 0,
        lastServiced: "N/A",
      };
      setResources(prev => [newRes, ...prev]);
      showToast(`"${form.name}" added successfully.`);
    }
    setShowAddModal(false);
    setFormError("");
  };

  const handleDelete = (id) => {
    const res = resources.find(r => r.id === id);
    setResources(prev => prev.filter(r => r.id !== id));
    setDeleteId(null);
    setDetailRes(null);
    showToast(`"${res?.name}" removed.`, "error");
  };

  const toggleStatus = (id) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next = r.status === "Available" ? "Under Maintenance"
                 : r.status === "Under Maintenance" ? "Available"
                 : r.status;
      return { ...r, status: next };
    }));
    showToast("Resource status updated.");
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="hr-root">

      {/* ── Sidebar ── */}
      <aside className="hr-sidebar">
        <div className="hr-brand">
          <span className="hr-brand-icon"><GridIcon /></span>
          <span className="hr-brand-text">Resource Allocation<br />System</span>
        </div>
        <nav className="hr-nav">
          {NAV_ITEMS.map(({ label, Icon }) => (
            <button
              key={label}
              className={`hr-nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => handleNav(label)}
            >
              <span className="hr-nav-icon"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="hr-main">

        {/* Header */}
        <header className="hr-header">
          <div>
            <h1 className="hr-title">Resources</h1>
            <p className="hr-subtitle">Manage all department resources — labs, halls, and classrooms.</p>
          </div>
          <div className="hr-header-right">
            <button className="hr-notif-btn">
              <BellIcon />
              <span className="hr-notif-badge">3</span>
            </button>
            <div className="hr-user-chip">
              <div className="hr-avatar">M</div>
              <div className="hr-user-text">
                <span className="hr-user-name">Dr. Michael Brown</span>
                <span className="hr-user-role">HOD – CSE Department</span>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="hr-content">

          {/* ── Stats ── */}
          <div className="hr-stats">
            {[
              { label: "Total Resources", value: stats.total,       color: "blue",   Icon: TotalResIcon   },
              { label: "Available",       value: stats.available,   color: "green",  Icon: AvailIcon      },
              { label: "Currently Booked",value: stats.booked,      color: "orange", Icon: BookedResIcon  },
              { label: "Under Maintenance",value:stats.maintenance, color: "red",    Icon: MaintIcon      },
            ].map(({ label, value, color, Icon: Ic }) => (
              <div key={label} className="hr-stat">
                <div className={`hr-stat-icon hr-stat-icon--${color}`}><Ic /></div>
                <div>
                  <p className="hr-stat-value">{value}</p>
                  <p className="hr-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className="hr-toolbar">
            <div className="hr-toolbar-left">
              {/* Search */}
              <div className="hr-search-wrap">
                <SearchIcon />
                <input
                  className="hr-search"
                  placeholder="Search resources…"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
                {searchQ && (
                  <button className="hr-search-clear" onClick={() => setSearchQ("")}><XIcon /></button>
                )}
              </div>
              {/* Type filter */}
              <select className="hr-filter-sel" value={filterType} onChange={e => setFilterType(e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              {/* Status filter */}
              <select className="hr-filter-sel" value={filterStat} onChange={e => setFilterStat(e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="hr-toolbar-right">
              {/* View toggle */}
              <div className="hr-view-toggle">
                {VIEW_MODES.map(m => (
                  <button
                    key={m}
                    className={`hr-view-btn ${viewMode === m ? "active" : ""}`}
                    onClick={() => setViewMode(m)}
                    title={m === "grid" ? "Grid View" : "List View"}
                  >
                    {m === "grid" ? <GridViewIcon /> : <ListViewIcon />}
                  </button>
                ))}
              </div>
              {/* Add resource */}
              <button className="hr-add-btn" onClick={openAdd}>
                <PlusIcon /> Add Resource
              </button>
            </div>
          </div>

          {/* ── Results info ── */}
          <div className="hr-results-bar">
            Showing <strong>{filtered.length}</strong> of <strong>{resources.length}</strong> resources
          </div>

          {/* ── Empty ── */}
          {filtered.length === 0 ? (
            <div className="hr-empty">
              <EmptyResIcon />
              <p>No resources match your filters.</p>
              <button className="hr-reset-btn" onClick={() => { setFilterType("All Types"); setFilterStat("All Status"); setSearchQ(""); }}>
                Reset Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (

            /* ══ GRID VIEW ══ */
            <div className="hr-grid">
              {filtered.map(res => (
                <div
                  key={res.id}
                  className={`hr-card hr-card--${res.status === "Available" ? "available" : res.status === "Booked" ? "booked" : "maintenance"}`}
                  onClick={() => setDetailRes(res)}
                >
                  <div className="hr-card-top">
                    <div className={`hr-card-icon-wrap hr-card-icon-wrap--${res.type.toLowerCase()}`}>
                      {res.type === "Lab"       ? <LabIcon />       :
                       res.type === "Hall"      ? <HallIcon />      : <ClassroomIcon />}
                    </div>
                    <span className={`hr-status-dot hr-status-dot--${res.status === "Available" ? "avail" : res.status === "Booked" ? "booked" : "maint"}`} title={res.status} />
                  </div>

                  <div className="hr-card-body">
                    <h3 className="hr-card-name">{res.name}</h3>
                    <p className="hr-card-meta">
                      <LocationIcon /> {res.building}, {res.floor}
                    </p>
                    <p className="hr-card-meta">
                      <CapacityIcon /> {res.capacity} seats &nbsp;·&nbsp;
                      <span className={`hr-card-type-tag hr-card-type-tag--${res.type.toLowerCase()}`}>{res.type}</span>
                    </p>
                  </div>

                  {/* Utilization bar */}
                  <div className="hr-util-wrap">
                    <div className="hr-util-row">
                      <span className="hr-util-label">Utilization</span>
                      <span className="hr-util-pct">{res.utilization}%</span>
                    </div>
                    <div className="hr-util-bar">
                      <div
                        className={`hr-util-fill ${res.utilization >= 80 ? "hr-util-fill--high" : res.utilization >= 50 ? "hr-util-fill--mid" : "hr-util-fill--low"}`}
                        style={{ width: `${res.utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="hr-card-footer">
                    <span className={`hr-status-badge hr-status-badge--${res.status === "Available" ? "avail" : res.status === "Booked" ? "booked" : "maint"}`}>
                      {res.status}
                    </span>
                    <span className="hr-bookings-count">{res.bookingsThisMonth} bookings</span>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            /* ══ LIST VIEW ══ */
            <div className="hr-list-card">
              <table className="hr-list-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Resource</th><th>Type</th>
                    <th>Location</th><th>Capacity</th><th>Utilization</th>
                    <th>Status</th><th>Bookings</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(res => (
                    <tr key={res.id} className="hr-list-tr" onClick={() => setDetailRes(res)}>
                      <td><span className="hr-list-id">{res.id}</span></td>
                      <td>
                        <div className="hr-list-name-cell">
                          <span className={`hr-list-type-dot hr-list-type-dot--${res.type.toLowerCase()}`} />
                          <span className="hr-list-name">{res.name}</span>
                        </div>
                      </td>
                      <td><span className={`hr-card-type-tag hr-card-type-tag--${res.type.toLowerCase()}`}>{res.type}</span></td>
                      <td className="hr-list-loc">{res.building}, {res.floor}</td>
                      <td className="hr-list-cap">{res.capacity}</td>
                      <td>
                        <div className="hr-list-util">
                          <div className="hr-util-bar hr-util-bar--sm">
                            <div className={`hr-util-fill ${res.utilization >= 80 ? "hr-util-fill--high" : res.utilization >= 50 ? "hr-util-fill--mid" : "hr-util-fill--low"}`}
                              style={{ width: `${res.utilization}%` }} />
                          </div>
                          <span className="hr-util-pct hr-util-pct--sm">{res.utilization}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`hr-status-badge hr-status-badge--${res.status === "Available" ? "avail" : res.status === "Booked" ? "booked" : "maint"}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="hr-list-bookings">{res.bookingsThisMonth}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="hr-list-actions">
                          <button className="hr-list-edit-btn" onClick={() => openEdit(res)} title="Edit"><EditIcon /></button>
                          <button className="hr-list-del-btn" onClick={() => setDeleteId(res.id)} title="Delete"><TrashIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ══ Detail Drawer ════════════════════════ */}
      {detailRes && (
        <div className="hr-overlay" onClick={() => setDetailRes(null)}>
          <div className="hr-drawer" onClick={e => e.stopPropagation()}>
            <div className="hr-drawer-header">
              <div className={`hr-drawer-icon hr-drawer-icon--${detailRes.type.toLowerCase()}`}>
                {detailRes.type === "Lab" ? <LabIcon /> : detailRes.type === "Hall" ? <HallIcon /> : <ClassroomIcon />}
              </div>
              <div className="hr-drawer-title-block">
                <h2 className="hr-drawer-title">{detailRes.name}</h2>
                <p className="hr-drawer-id">{detailRes.id}</p>
              </div>
              <button className="hr-drawer-close" onClick={() => setDetailRes(null)}><XIcon /></button>
            </div>

            <div className="hr-drawer-body">
              <span className={`hr-status-badge hr-status-badge--${detailRes.status === "Available" ? "avail" : detailRes.status === "Booked" ? "booked" : "maint"} hr-status-badge--lg`}>
                {detailRes.status}
              </span>

              {/* Utilization */}
              <div className="hr-drawer-util">
                <div className="hr-util-row">
                  <span className="hr-util-label">Monthly Utilization</span>
                  <span className="hr-util-pct">{detailRes.utilization}%</span>
                </div>
                <div className="hr-util-bar">
                  <div className={`hr-util-fill ${detailRes.utilization >= 80 ? "hr-util-fill--high" : detailRes.utilization >= 50 ? "hr-util-fill--mid" : "hr-util-fill--low"}`}
                    style={{ width: `${detailRes.utilization}%` }} />
                </div>
              </div>

              {/* Details grid */}
              <div className="hr-drawer-grid">
                {[
                  { key: "Type",           val: detailRes.type           },
                  { key: "Building",       val: detailRes.building       },
                  { key: "Floor",          val: detailRes.floor          },
                  { key: "Capacity",       val: `${detailRes.capacity} seats` },
                  { key: "Bookings (Mo.)", val: detailRes.bookingsThisMonth   },
                  { key: "Maintained By",  val: detailRes.maintainedBy   },
                  { key: "Last Serviced",  val: detailRes.lastServiced   },
                ].map(({ key, val }) => (
                  <div key={key} className="hr-drawer-row">
                    <span className="hr-drawer-key">{key}</span>
                    <span className="hr-drawer-val">{val}</span>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <p className="hr-drawer-section-title">Amenities</p>
                <div className="hr-amenities">
                  {detailRes.amenities.map(a => (
                    <span key={a} className="hr-amenity-tag">{a}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="hr-drawer-actions">
                <button className="hr-btn-edit" onClick={() => openEdit(detailRes)}>
                  <EditIcon /> Edit Resource
                </button>
                {detailRes.status !== "Booked" && (
                  <button className="hr-btn-toggle" onClick={() => { toggleStatus(detailRes.id); setDetailRes(null); }}>
                    <ToggleIcon />
                    {detailRes.status === "Available" ? "Mark Maintenance" : "Mark Available"}
                  </button>
                )}
                <button className="hr-btn-delete" onClick={() => { setDeleteId(detailRes.id); }}>
                  <TrashIcon /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Add / Edit Modal ═════════════════════ */}
      {showAddModal && (
        <div className="hr-overlay" onClick={() => setShowAddModal(false)}>
          <div className="hr-modal" onClick={e => e.stopPropagation()}>
            <div className="hr-modal-header">
              <div>
                <h2 className="hr-modal-title">{editRes ? "Edit Resource" : "Add New Resource"}</h2>
                <p className="hr-modal-sub">{editRes ? `Editing ${editRes.name}` : "Fill in the details to add a resource."}</p>
              </div>
              <button className="hr-drawer-close" onClick={() => setShowAddModal(false)}><XIcon /></button>
            </div>

            <form className="hr-form" onSubmit={handleFormSubmit}>
              <div className="hr-form-row">
                <div className="hr-form-group hr-form-group--full">
                  <label className="hr-label">Resource Name *</label>
                  <input className="hr-input" name="name" placeholder="e.g. Computer Lab 3" value={form.name} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="hr-form-row">
                <div className="hr-form-group">
                  <label className="hr-label">Type *</label>
                  <select className="hr-select" name="type" value={form.type} onChange={handleFormChange}>
                    <option>Lab</option><option>Hall</option><option>Classroom</option>
                  </select>
                </div>
                <div className="hr-form-group">
                  <label className="hr-label">Status</label>
                  <select className="hr-select" name="status" value={form.status} onChange={handleFormChange}>
                    <option>Available</option><option>Booked</option><option>Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="hr-form-row">
                <div className="hr-form-group">
                  <label className="hr-label">Building *</label>
                  <input className="hr-input" name="building" placeholder="e.g. Block A" value={form.building} onChange={handleFormChange} required />
                </div>
                <div className="hr-form-group">
                  <label className="hr-label">Floor *</label>
                  <input className="hr-input" name="floor" placeholder="e.g. Level 2" value={form.floor} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="hr-form-row">
                <div className="hr-form-group">
                  <label className="hr-label">Capacity (seats) *</label>
                  <input className="hr-input" name="capacity" type="number" min="1" placeholder="e.g. 40" value={form.capacity} onChange={handleFormChange} required />
                </div>
                <div className="hr-form-group">
                  <label className="hr-label">Maintained By</label>
                  <input className="hr-input" name="maintainedBy" placeholder="e.g. IT Dept" value={form.maintainedBy} onChange={handleFormChange} />
                </div>
              </div>

              <div className="hr-form-group hr-form-group--full">
                <label className="hr-label">Amenities <span className="hr-label-hint">(comma-separated)</span></label>
                <input className="hr-input" name="amenities" placeholder="e.g. Wi-Fi, Projector, AC" value={form.amenities} onChange={handleFormChange} />
              </div>

              {formError && (
                <div className="hr-form-error"><InfoIcon /> {formError}</div>
              )}

              <div className="hr-form-actions">
                <button type="button" className="hr-btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="hr-btn-primary">
                  {editRes ? "Save Changes" : "Add Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ Delete Confirm ═══════════════════════ */}
      {deleteId && (
        <div className="hr-overlay" onClick={() => setDeleteId(null)}>
          <div className="hr-confirm" onClick={e => e.stopPropagation()}>
            <div className="hr-confirm-icon"><WarnIcon /></div>
            <h3 className="hr-confirm-title">Delete Resource?</h3>
            <p className="hr-confirm-msg">
              This will permanently remove <strong>{resources.find(r => r.id === deleteId)?.name}</strong> and all its data.
            </p>
            <div className="hr-confirm-btns">
              <button className="hr-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="hr-btn-danger"    onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`hr-toast hr-toast--${toast.type}`}>
          {toast.type === "success" ? <CheckIcon /> : <XIcon />}
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
function RequestsIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>; }
function BookingsIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function ResourcesIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function ReportsIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function ProfileIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }
function LogoutIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function BellIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>; }
function ChevronDownIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>; }
function SearchIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>; }
function PlusIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function XIcon()         { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function CheckIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>; }
function EditIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function TrashIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function ToggleIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>; }
function InfoIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="12" x2="12" y2="16"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>; }
function WarnIcon()      { return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function LabIcon()       { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3h6M9 3v6l-4 9a1 1 0 00.9 1.5h12.2A1 1 0 0019 18l-4-9V3"/><line x1="6.5" y1="14" x2="17.5" y2="14"/></svg>; }
function HallIcon()      { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function ClassroomIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function LocationIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CapacityIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>; }
function GridViewIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>; }
function ListViewIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function TotalResIcon()  { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function AvailIcon()     { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>; }
function BookedResIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MaintIcon()     { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M12 20v2M12 2v2"/></svg>; }
function EmptyResIcon()  { return <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }