import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login"; // New import
import FacultyDashboard from "./pages/FacultyDashboard";
import ResourceCalendar from "./pages/ResourceCalendar";
import ShowResources from "./pages/ShowResources";
import MyRequests from "./pages/MyRequests"; // ✅ import
import HodDashboard from "./pages/HodDashboard";
import HodAllBookings from "./pages/HodAllBookings";
import HodResources from "./pages/HodResources";
import HodUploadTimetable from "./pages/HodUploadTimetable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/resource-calendar" element={<ResourceCalendar />} />
        <Route path ="/show-resources" element={<ShowResources />} />
        <Route path="/my-requests" element={<MyRequests />} /> // ✅ add this
        <Route path="/hod-dashboard" element={<HodDashboard />} />
        <Route path="/hod-all-bookings" element={<HodAllBookings />} />
        <Route path="/hod-resources" element={<HodResources />} />
        <Route path="/hod-upload-timetable" element={<HodUploadTimetable />} />
      </Routes>
    </Router>
  );
}

export default App;