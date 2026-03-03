import React, { useState, useEffect } from "react";
import Sidebar from "../layouts/Sidebar";
import TopBar from "../layouts/TopBar";
import Card from "../common/Card";
import Modal from "../common/Modal";
import Notification from "../common/Notification";
import FilterSection from "../common/FilterSection";
import "./Dashboard.css";

// ===== HELPER FUNCTIONS =====
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getBadgeClass = (recognition) => {
  if (!recognition) return "badge info";
  const classes = {
    gold: "badge gold",
    silver: "badge silver",
    bronze: "badge bronze",
    participation: "badge info",
  };
  return classes[recognition.toLowerCase()] || "badge info";
};

const getStatusClass = (status) => {
  if (!status) return "badge info";
  const classes = {
    verified: "badge success",
    pending: "badge warning",
    active: "badge success",
    inactive: "badge danger",
    open: "badge success",
    soon: "badge warning",
  };
  return classes[status.toLowerCase()] || "badge info";
};

const showNotification = (message, type = "info") => {
  const event = new CustomEvent("notification", { detail: { message, type } });
  window.dispatchEvent(event);
};

// ===== MOCK DATA =====
const initialAchievements = [
  {
    id: 1,
    student: "John Doe",
    title: "Chess Tournament Winner",
    category: "Sports",
    date: "2024-01-15",
    recognition: "Gold",
    status: "Verified",
  },
  {
    id: 2,
    student: "Jane Smith",
    title: "Science Fair Winner",
    category: "Academic",
    date: "2024-01-10",
    recognition: "Silver",
    status: "Verified",
  },
  {
    id: 3,
    student: "Mike Johnson",
    title: "Debate Competition",
    category: "Cultural",
    date: "2024-01-05",
    recognition: "Bronze",
    status: "Pending",
  },
  {
    id: 4,
    student: "Sarah Wilson",
    title: "Art Exhibition",
    category: "Cultural",
    date: "2024-01-03",
    recognition: "Silver",
    status: "Pending",
  },
  {
    id: 5,
    student: "Tom Brown",
    title: "Basketball MVP",
    category: "Sports",
    date: "2023-12-28",
    recognition: "Gold",
    status: "Verified",
  },
];

const initialStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "john@achievex.com",
    grade: "10th",
    achievements: 8,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@achievex.com",
    grade: "11th",
    achievements: 12,
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@achievex.com",
    grade: "9th",
    achievements: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@achievex.com",
    grade: "12th",
    achievements: 7,
    status: "Active",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@achievex.com",
    grade: "10th",
    achievements: 6,
    status: "Active",
  },
];

const initialTeachers = [
  {
    id: "T001",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@achievex.com",
    department: "Science",
    classes: 4,
    students: 120,
  },
  {
    id: "T002",
    name: "Prof. James Brown",
    email: "james.brown@achievex.com",
    department: "Mathematics",
    classes: 3,
    students: 90,
  },
  {
    id: "T003",
    name: "Dr. Emily Chen",
    email: "emily.chen@achievex.com",
    department: "Physics",
    classes: 3,
    students: 75,
  },
];

const initialEvents = [
  {
    id: 1,
    name: "Chess Tournament",
    date: "2024-02-15",
    venue: "Auditorium",
    participants: 24,
    status: "Open",
    icon: "chess",
  },
  {
    id: 2,
    name: "Science Fair",
    date: "2024-02-20",
    venue: "Science Hall",
    participants: 35,
    status: "Open",
    icon: "flask",
  },
  {
    id: 3,
    name: "Annual Day",
    date: "2024-03-05",
    venue: "Auditorium",
    participants: 120,
    status: "Soon",
    icon: "music",
  },
];

const menuItems = {
  admin: [
    {
      category: "MAIN",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: "fas fa-home",
          count: "Live",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: "fas fa-chart-line",
          count: "12",
        },
      ],
    },
    {
      category: "MANAGEMENT",
      items: [
        {
          id: "achievements",
          label: "Achievements",
          icon: "fas fa-trophy",
          count: "156",
        },
        {
          id: "students",
          label: "Students",
          icon: "fas fa-users",
          count: "89",
        },
        {
          id: "teachers",
          label: "Teachers",
          icon: "fas fa-chalkboard-teacher",
          count: "24",
        },
      ],
    },
    {
      category: "ACTIVITIES",
      items: [
        {
          id: "events",
          label: "Events",
          icon: "fas fa-calendar-alt",
          count: "8",
        },
        { id: "reports", label: "Reports", icon: "fas fa-file-alt" },
        {
          id: "messages",
          label: "Messages",
          icon: "fas fa-envelope",
          count: "4",
        },
      ],
    },
    {
      category: "SYSTEM",
      items: [
        { id: "settings", label: "Settings", icon: "fas fa-cog" },
        { id: "profile", label: "Profile", icon: "fas fa-user-cog" },
        { id: "backup", label: "Backup", icon: "fas fa-database" },
        { id: "logs", label: "Activity Logs", icon: "fas fa-history" },
      ],
    },
  ],
};

const AdminDashboard = ({ onLogout }) => {
  // ===== STATE MANAGEMENT =====
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarActive, setSidebarActive] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Data State
  const [achievements, setAchievements] = useState(initialAchievements);
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [events, setEvents] = useState(initialEvents);

  // Filter State
  const [filteredAchievements, setFilteredAchievements] =
    useState(initialAchievements);
  const [filteredStudents, setFilteredStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ===== NOTIFICATION SYSTEM =====
  useEffect(() => {
    const handleNotification = (e) => {
      setNotifications((prev) => [...prev, { id: Date.now(), ...e.detail }]);
    };
    window.addEventListener("notification", handleNotification);
    return () => window.removeEventListener("notification", handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ===== SIDEBAR FUNCTIONS =====
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarActive(false);
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // ===== MODAL FUNCTIONS =====
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingId(item ? item.id : null);
    setFormData(item || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===== CRUD OPERATIONS =====
  const handleSubmit = () => {
    if (modalType === "achievement" && !formData.title) {
      showNotification("Please fill achievement title", "error");
      return;
    }
    if (modalType === "student" && !formData.name) {
      showNotification("Please fill student name", "error");
      return;
    }
    if (modalType === "teacher" && !formData.name) {
      showNotification("Please fill teacher name", "error");
      return;
    }
    if (modalType === "event" && !formData.name) {
      showNotification("Please fill event name", "error");
      return;
    }

    switch (modalType) {
      case "achievement":
        if (editingId) {
          setAchievements((prev) =>
            prev.map((item) =>
              item.id === editingId ? { ...item, ...formData } : item,
            ),
          );
          showNotification("Achievement updated successfully!", "success");
        } else {
          const newAchievement = {
            id: achievements.length + 1,
            student: formData.student || "New Student",
            title: formData.title,
            category: formData.category || "Sports",
            date: new Date().toISOString().split("T")[0],
            recognition: formData.recognition || "Gold",
            status: "Pending",
          };
          setAchievements((prev) => [...prev, newAchievement]);
          showNotification("Achievement added successfully!", "success");
        }
        break;

      case "student":
        if (editingId) {
          setStudents((prev) =>
            prev.map((item) =>
              item.id === editingId ? { ...item, ...formData } : item,
            ),
          );
          showNotification("Student updated successfully!", "success");
        } else {
          const newStudent = {
            id: students.length + 1,
            name: formData.name,
            email: formData.email || "new@student.com",
            grade: formData.grade || "10th",
            achievements: 0,
            status: "Active",
          };
          setStudents((prev) => [...prev, newStudent]);
          showNotification("Student added successfully!", "success");
        }
        break;

      case "teacher":
        if (editingId) {
          setTeachers((prev) =>
            prev.map((item) =>
              item.id === editingId ? { ...item, ...formData } : item,
            ),
          );
          showNotification("Teacher updated successfully!", "success");
        } else {
          const newTeacher = {
            id: `T00${teachers.length + 1}`,
            name: formData.name,
            email: formData.email || "teacher@achievex.com",
            department: formData.department || "Science",
            classes: 0,
            students: 0,
          };
          setTeachers((prev) => [...prev, newTeacher]);
          showNotification("Teacher added successfully!", "success");
        }
        break;

      case "event":
        if (editingId) {
          setEvents((prev) =>
            prev.map((item) =>
              item.id === editingId ? { ...item, ...formData } : item,
            ),
          );
          showNotification("Event updated successfully!", "success");
        } else {
          const newEvent = {
            id: events.length + 1,
            name: formData.name,
            date: formData.date || new Date().toISOString().split("T")[0],
            venue: formData.venue || "TBD",
            participants: 0,
            status: "Open",
            icon: "calendar",
          };
          setEvents((prev) => [...prev, newEvent]);
          showNotification("Event created successfully!", "success");
        }
        break;

      default:
        showNotification("Saved successfully!", "success");
    }

    closeModal();
    applyFilters();
  };

  const deleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      switch (type) {
        case "achievement":
          setAchievements((prev) => prev.filter((item) => item.id !== id));
          showNotification("Achievement deleted successfully!", "success");
          break;
        case "student":
          setStudents((prev) => prev.filter((item) => item.id !== id));
          showNotification("Student deleted successfully!", "success");
          break;
        case "teacher":
          setTeachers((prev) => prev.filter((item) => item.id !== id));
          showNotification("Teacher deleted successfully!", "success");
          break;
        case "event":
          setEvents((prev) => prev.filter((item) => item.id !== id));
          showNotification("Event deleted successfully!", "success");
          break;
        default:
          break;
      }
      applyFilters();
    }
  };

  // ===== FILTER FUNCTIONS =====
  const applyFilters = () => {
    // Filter achievements
    let filtered = [...achievements];
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          (a.title &&
            a.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (a.student &&
            a.student.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (a) =>
          a.category &&
          a.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (a) =>
          a.status && a.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    setFilteredAchievements(filtered);

    // Filter students
    let filteredStudentsList = [...students];
    if (searchTerm) {
      filteredStudentsList = filteredStudentsList.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }
    setFilteredStudents(filteredStudentsList);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setTimeout(applyFilters, 100);
  };

  const handleFilterChange = (name, value) => {
    if (name === "category") setCategoryFilter(value);
    if (name === "status") setStatusFilter(value);
    if (name === "apply") {
      applyFilters();
      showNotification("Filters applied", "success");
    }
  };

  // ===== EXPORT FUNCTIONS =====
  const exportData = (type) => {
    let data = [];
    let filename = "";

    switch (type) {
      case "achievements":
        data = achievements;
        filename = "achievements_export.csv";
        break;
      case "students":
        data = students;
        filename = "students_export.csv";
        break;
      case "teachers":
        data = teachers;
        filename = "teachers_export.csv";
        break;
      default:
        return;
    }

    if (data.length === 0) {
      showNotification("No data to export", "error");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) => Object.values(item).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    showNotification(`${type} exported successfully!`, "success");
  };

  const verifyAchievement = (id) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Verified" } : a)),
    );
    showNotification("Achievement verified!", "success");
    applyFilters();
  };

  // ===== RENDER SECTIONS =====
  const renderDashboard = () => {
    const totalAchievements = achievements.length;
    const verifiedCount = achievements.filter(
      (a) => a.status === "Verified",
    ).length;
    const pendingCount = achievements.filter(
      (a) => a.status === "Pending",
    ).length;
    const sportsCount = achievements.filter(
      (a) => a.category === "Sports",
    ).length;
    const academicCount = achievements.filter(
      (a) => a.category === "Academic",
    ).length;
    const culturalCount = achievements.filter(
      (a) => a.category === "Cultural",
    ).length;

    return (
      <>
        <div className="cards-container">
          <Card
            title="Total Achievements"
            value={totalAchievements}
            icon="fas fa-trophy"
            trend={{
              percentage: "78%",
              text: `${verifiedCount} verified`,
              color: "var(--success)",
            }}
          />
          <Card
            title="Active Students"
            value={students.length}
            icon="fas fa-users"
            trend={{
              percentage: "89%",
              text: `${students.filter((s) => s.status === "Active").length} active`,
              color: "var(--success)",
            }}
          />
          <Card
            title="Pending Verification"
            value={pendingCount}
            icon="fas fa-clock"
            trend={{
              percentage: "46%",
              text: "Need attention",
              color: "var(--warning)",
            }}
          />
          <Card
            title="Active Events"
            value={events.length}
            icon="fas fa-calendar-check"
            trend={{
              percentage: "60%",
              text: `${events.filter((e) => e.status === "Open").length} open`,
              color: "var(--info)",
            }}
          />
        </div>

        <div className="stats-grid">
          <div
            className="stat-item"
            onClick={() => {
              setCategoryFilter("sports");
              handleSectionChange("achievements");
            }}
          >
            <div className="stat-value">{sportsCount}</div>
            <div className="stat-label">Sports</div>
          </div>
          <div
            className="stat-item"
            onClick={() => {
              setCategoryFilter("academic");
              handleSectionChange("achievements");
            }}
          >
            <div className="stat-value">{academicCount}</div>
            <div className="stat-label">Academic</div>
          </div>
          <div
            className="stat-item"
            onClick={() => {
              setCategoryFilter("cultural");
              handleSectionChange("achievements");
            }}
          >
            <div className="stat-value">{culturalCount}</div>
            <div className="stat-label">Cultural</div>
          </div>
          <div
            className="stat-item"
            onClick={() => handleSectionChange("teachers")}
          >
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Teachers</div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Recent Achievements</h2>
            <div className="table-actions">
              <button
                className="action-btn secondary-btn"
                onClick={() => exportData("achievements")}
              >
                <i className="fas fa-download"></i> Export
              </button>
              <button
                className="action-btn primary-btn"
                onClick={() => openModal("achievement")}
              >
                <i className="fas fa-plus"></i> Add New
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Achievement</th>
                <th>Category</th>
                <th>Date</th>
                <th>Recognition</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.slice(0, 5).map((a) => (
                <tr key={a.id}>
                  <td>{a.student}</td>
                  <td>{a.title}</td>
                  <td>
                    <span className="badge info">{a.category}</span>
                  </td>
                  <td>{formatDate(a.date)}</td>
                  <td>
                    <span className={getBadgeClass(a.recognition)}>
                      {a.recognition}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusClass(a.status)}>{a.status}</span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => openModal("achievement", a)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteItem("achievement", a.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    {a.status === "Pending" && (
                      <button
                        className="action-btn success"
                        onClick={() => verifyAchievement(a.id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cards-container">
          <div className="card chart-card">
            <div className="card-header">
              <h3>Monthly Achievement Trend</h3>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="chart-container">
              {[45, 60, 38, 72, 55, 68].map((height, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${height}px` }}
                  data-value={height}
                ></div>
              ))}
            </div>
            <div className="chart-labels">
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
            </div>
          </div>
          <div className="card chart-card">
            <div className="card-header">
              <h3>Achievement Distribution</h3>
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="pie-container">
              <div className="pie-chart"></div>
              <div className="pie-legend">
                <div>
                  <span style={{ color: "var(--primary)" }}>●</span> Sports:{" "}
                  {sportsCount}
                </div>
                <div>
                  <span style={{ color: "var(--secondary)" }}>●</span> Academic:{" "}
                  {academicCount}
                </div>
                <div>
                  <span style={{ color: "var(--success)" }}>●</span> Cultural:{" "}
                  {culturalCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAchievements = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>All Achievements</h2>
          <div className="table-actions">
            <button
              className="action-btn secondary-btn"
              onClick={() => exportData("achievements")}
            >
              <i className="fas fa-download"></i> Export
            </button>
            <button
              className="action-btn primary-btn"
              onClick={() => openModal("achievement")}
            >
              <i className="fas fa-plus"></i> Add New
            </button>
          </div>
        </div>

        <FilterSection
          onSearch={handleSearch}
          filters={[
            {
              name: "category",
              placeholder: "All Categories",
              options: [
                { value: "sports", label: "Sports" },
                { value: "academic", label: "Academic" },
                { value: "cultural", label: "Cultural" },
              ],
            },
            {
              name: "status",
              placeholder: "All Status",
              options: [
                { value: "verified", label: "Verified" },
                { value: "pending", label: "Pending" },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
        />

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Recognition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAchievements.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.student}</td>
                <td>{a.title}</td>
                <td>
                  <span className="badge info">{a.category}</span>
                </td>
                <td>{formatDate(a.date)}</td>
                <td>
                  <span className={getBadgeClass(a.recognition)}>
                    {a.recognition}
                  </span>
                </td>
                <td>
                  <span className={getStatusClass(a.status)}>{a.status}</span>
                </td>
                <td className="actions">
                  <button
                    className="action-btn edit"
                    onClick={() => openModal("achievement", a)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteItem("achievement", a.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  {a.status === "Pending" && (
                    <button
                      className="action-btn success"
                      onClick={() => verifyAchievement(a.id)}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <span>
            Showing 1-{filteredAchievements.length} of {achievements.length}{" "}
            entries
          </span>
          <div>
            <button
              className="action-btn secondary-btn"
              onClick={() => showNotification("Previous page", "info")}
            >
              Previous
            </button>
            <button
              className="action-btn primary-btn"
              style={{ margin: "0 5px" }}
            >
              1
            </button>
            <button
              className="action-btn secondary-btn"
              onClick={() => showNotification("Next page", "info")}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStudents = () => {
    const activeCount = students.filter((s) => s.status === "Active").length;

    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Student Directory</h2>
          <div className="table-actions">
            <button
              className="action-btn secondary-btn"
              onClick={() => exportData("students")}
            >
              <i className="fas fa-download"></i> Export
            </button>
            <button
              className="action-btn primary-btn"
              onClick={() => openModal("student")}
            >
              <i className="fas fa-user-plus"></i> Add Student
            </button>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: "20px" }}>
          <div className="stat-item">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{activeCount}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {students.reduce((sum, s) => sum + s.achievements, 0)}
            </div>
            <div className="stat-label">Total Achievements</div>
          </div>
        </div>

        <FilterSection
          onSearch={handleSearch}
          filters={[
            {
              name: "grade",
              placeholder: "All Grades",
              options: [
                { value: "9th", label: "Grade 9" },
                { value: "10th", label: "Grade 10" },
                { value: "11th", label: "Grade 11" },
                { value: "12th", label: "Grade 12" },
              ],
            },
            {
              name: "status",
              placeholder: "All Status",
              options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
        />

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Achievements</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.grade}</td>
                <td>
                  <span className="badge gold">{s.achievements}</span>
                </td>
                <td>
                  <span className={getStatusClass(s.status)}>{s.status}</span>
                </td>
                <td className="actions">
                  <button
                    className="action-btn view"
                    onClick={() =>
                      showNotification(`Viewing ${s.name}'s profile`, "info")
                    }
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => openModal("student", s)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteItem("student", s.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTeachers = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Faculty Directory</h2>
          <div className="table-actions">
            <button
              className="action-btn secondary-btn"
              onClick={() => exportData("teachers")}
            >
              <i className="fas fa-download"></i> Export
            </button>
            <button
              className="action-btn primary-btn"
              onClick={() => openModal("teacher")}
            >
              <i className="fas fa-user-plus"></i> Add Teacher
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Total Teachers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {teachers.reduce((sum, t) => sum + t.students, 0)}
            </div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {teachers.reduce((sum, t) => sum + t.classes, 0)}
            </div>
            <div className="stat-label">Classes</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Classes</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>
                  <span className="badge info">{t.department}</span>
                </td>
                <td>{t.classes}</td>
                <td>{t.students}</td>
                <td className="actions">
                  <button
                    className="action-btn edit"
                    onClick={() => openModal("teacher", t)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteItem("teacher", t.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEvents = () => {
    return (
      <>
        <div className="cards-container">
          <Card
            title="Total Events"
            value={events.length}
            icon="fas fa-calendar"
          />
          <Card
            title="Open Events"
            value={events.filter((e) => e.status === "Open").length}
            icon="fas fa-door-open"
          />
          <Card
            title="Total Participants"
            value={events.reduce((sum, e) => sum + e.participants, 0)}
            icon="fas fa-users"
          />
        </div>

        <div className="achievement-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="achievement-card"
              onClick={() => openModal("event", event)}
            >
              <div className="achievement-icon">
                <i className={`fas fa-${event.icon || "calendar"}`}></i>
              </div>
              <div className="achievement-title">{event.name}</div>
              <div className="achievement-date">{formatDate(event.date)}</div>
              <p>
                <i className="fas fa-map-marker-alt"></i> {event.venue}
              </p>
              <p>
                <i className="fas fa-users"></i> {event.participants}{" "}
                participants
              </p>
              <span
                className={`badge ${event.status === "Open" ? "success" : event.status === "Soon" ? "warning" : "info"}`}
              >
                {event.status}
              </span>
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  className="action-btn edit"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal("event", event);
                  }}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  className="action-btn delete"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem("event", event.id);
                  }}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="action-btn primary-btn"
            onClick={() => openModal("event")}
          >
            <i className="fas fa-plus"></i> Create New Event
          </button>
        </div>
      </>
    );
  };

  const renderAnalytics = () => {
    const monthlyData = [45, 60, 38, 72, 55, 68, 82, 94, 78, 65, 88, 92];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      <>
        <div className="cards-container">
          <Card title="Total Views" value="12,547" icon="fas fa-eye" />
          <Card title="Unique Visitors" value="3,203" icon="fas fa-users" />
          <Card title="Avg. Time" value="4m 32s" icon="fas fa-clock" />
          <Card title="Bounce Rate" value="32%" icon="fas fa-chart-line" />
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Monthly Performance</h2>
            <select
              className="filter-select"
              style={{ width: "150px" }}
              onChange={(e) =>
                showNotification(`Year ${e.target.value} selected`, "info")
              }
            >
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="chart-container" style={{ height: "300px" }}>
            {monthlyData.map((height, i) => (
              <div
                key={i}
                className="chart-bar"
                style={{ height: `${height}px` }}
                data-value={height}
              >
                <span className="bar-label">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Top Performing Students</h2>
            <button
              className="action-btn primary-btn"
              onClick={() => handleSectionChange("students")}
            >
              View All
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Grade</th>
                <th>Achievements</th>
                <th>Points</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🥇 1</td>
                <td>Jane Smith</td>
                <td>11th</td>
                <td>12</td>
                <td>450</td>
                <td>
                  <span style={{ color: "var(--success)" }}>↑ 23%</span>
                </td>
              </tr>
              <tr>
                <td>🥈 2</td>
                <td>John Doe</td>
                <td>10th</td>
                <td>8</td>
                <td>320</td>
                <td>
                  <span style={{ color: "var(--success)" }}>↑ 15%</span>
                </td>
              </tr>
              <tr>
                <td>🥉 3</td>
                <td>Sarah Wilson</td>
                <td>12th</td>
                <td>7</td>
                <td>290</td>
                <td>
                  <span style={{ color: "var(--success)" }}>↑ 8%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderReports = () => {
    return (
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Generate Report</h3>
            <i className="fas fa-file-pdf"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label>Report Type</label>
              <select
                className="filter-select"
                style={{ width: "100%" }}
                onChange={() => {}}
              >
                <option>Achievement Report</option>
                <option>Student Performance Report</option>
                <option>Event Participation Report</option>
                <option>Teacher Evaluation Report</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Range</label>
              <select
                className="filter-select"
                style={{ width: "100%" }}
                onChange={() => {}}
              >
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div className="form-group">
              <label>Format</label>
              <select
                className="filter-select"
                style={{ width: "100%" }}
                onChange={() => {}}
              >
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
            <button
              className="action-btn primary-btn"
              style={{ width: "100%" }}
              onClick={() =>
                showNotification("Report generated successfully!", "success")
              }
            >
              <i className="fas fa-download"></i> Generate Report
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Reports</h3>
            <i className="fas fa-history"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <i
                  className="fas fa-file-pdf"
                  style={{ color: "var(--danger)", marginRight: "10px" }}
                ></i>
                <span>Achievement_Report_Jan2024.pdf</span>
              </div>
              <button
                className="action-btn secondary-btn"
                onClick={() => showNotification("Downloading...", "info")}
              >
                <i className="fas fa-download"></i>
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <i
                  className="fas fa-file-excel"
                  style={{ color: "var(--success)", marginRight: "10px" }}
                ></i>
                <span>Student_Directory_2024.xlsx</span>
              </div>
              <button
                className="action-btn secondary-btn"
                onClick={() => showNotification("Downloading...", "info")}
              >
                <i className="fas fa-download"></i>
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <div>
                <i
                  className="fas fa-file-csv"
                  style={{ color: "var(--info)", marginRight: "10px" }}
                ></i>
                <span>Performance_Summary_Q1.csv</span>
              </div>
              <button
                className="action-btn secondary-btn"
                onClick={() => showNotification("Downloading...", "info")}
              >
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Scheduled Reports</h3>
            <i className="fas fa-clock"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                padding: "10px",
                background: "#f8fafc",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <h4>Weekly Achievement Summary</h4>
              <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
                Every Monday at 9:00 AM
              </p>
            </div>
            <div
              style={{
                padding: "10px",
                background: "#f8fafc",
                borderRadius: "10px",
              }}
            >
              <h4>Monthly Performance Report</h4>
              <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
                1st of every month at 8:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    const messages = [
      {
        id: 1,
        from: "Dr. Sarah Wilson",
        subject: "Science Fair Update",
        date: "2 hours ago",
        status: "unread",
      },
      {
        id: 2,
        from: "Prof. James Brown",
        subject: "Schedule Change Request",
        date: "5 hours ago",
        status: "read",
      },
      {
        id: 3,
        from: "John Doe (Parent)",
        subject: "Question about achievement",
        date: "1 day ago",
        status: "read",
      },
      {
        id: 4,
        from: "Jane Smith",
        subject: "New achievement submission",
        date: "2 days ago",
        status: "unread",
      },
    ];

    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Inbox</h2>
          <div className="table-actions">
            <button
              className="action-btn secondary-btn"
              onClick={() => showNotification("Refreshed", "success")}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
            <button
              className="action-btn primary-btn"
              onClick={() => openModal("message")}
            >
              <i className="fas fa-pen"></i> Compose
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ width: "250px" }}>
            <div className="menu-item active">
              <i className="fas fa-inbox"></i> Inbox
              <span className="badge-count">4</span>
            </div>
            <div className="menu-item">
              <i className="fas fa-paper-plane"></i> Sent
            </div>
            <div className="menu-item">
              <i className="fas fa-file"></i> Drafts
              <span className="badge-count">2</span>
            </div>
            <div className="menu-item">
              <i className="fas fa-trash"></i> Trash
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>
                    <input type="checkbox" />
                  </th>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    style={{
                      fontWeight: msg.status === "unread" ? "600" : "normal",
                    }}
                  >
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{msg.from}</td>
                    <td>{msg.subject}</td>
                    <td>{msg.date}</td>
                    <td>
                      {msg.status === "unread" ? (
                        <span className="badge info">Unread</span>
                      ) : (
                        <span className="badge success">Read</span>
                      )}
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn view"
                        onClick={() =>
                          showNotification("Opening message", "info")
                        }
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          showNotification("Message deleted", "success")
                        }
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>General Settings</h3>
            <i className="fas fa-cog"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                defaultValue="AchieveX Academy"
                onChange={() => {}}
              />
            </div>
            <div className="form-group">
              <label>Academic Year</label>
              <select onChange={() => {}}>
                <option>2023-2024</option>
                <option>2024-2025</option>
              </select>
            </div>
            <div className="form-group">
              <label>School Address</label>
              <textarea
                rows="3"
                defaultValue="123 Education Street, Learning City, 12345"
                onChange={() => {}}
              ></textarea>
            </div>
            <button
              className="action-btn primary-btn"
              onClick={() => showNotification("Settings saved!", "success")}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Security Settings</h3>
            <i className="fas fa-lock"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label>Two-Factor Authentication</label>
              <select onChange={() => {}}>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Session Timeout</label>
              <select onChange={() => {}}>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password Policy</label>
              <select onChange={() => {}}>
                <option>Strong</option>
                <option>Medium</option>
                <option>Basic</option>
              </select>
            </div>
            <button
              className="action-btn primary-btn"
              onClick={() =>
                showNotification("Security settings updated!", "success")
              }
            >
              Update Security
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Notification Settings</h3>
            <i className="fas fa-bell"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label>Email Notifications</label>
              <select onChange={() => {}}>
                <option>All</option>
                <option>Important Only</option>
                <option>None</option>
              </select>
            </div>
            <div className="form-group">
              <label>Push Notifications</label>
              <select onChange={() => {}}>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Daily Digest</label>
              <select onChange={() => {}}>
                <option>8:00 AM</option>
                <option>5:00 PM</option>
                <option>Disabled</option>
              </select>
            </div>
            <button
              className="action-btn primary-btn"
              onClick={() =>
                showNotification("Notification settings updated!", "success")
              }
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="table-container">
        <div style={{ textAlign: "center", padding: "30px" }}>
          <div
            className="user-avatar"
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto 20px",
              fontSize: "2.5rem",
            }}
          >
            A
          </div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
            Admin User
          </h2>
          <p
            style={{
              color: "var(--gray)",
              marginBottom: "5px",
              fontSize: "1.1rem",
            }}
          >
            admin@achievex.com
          </p>
          <p style={{ color: "var(--gray)", marginBottom: "20px" }}>
            Member since: January 2023
          </p>

          <div
            className="stats-grid"
            style={{ maxWidth: "600px", margin: "30px auto" }}
          >
            <div className="stat-item">
              <div className="stat-value">2</div>
              <div className="stat-label">Years Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{teachers.length}</div>
              <div className="stat-label">Teachers</div>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "15px", justifyContent: "center" }}
          >
            <button
              className="action-btn primary-btn"
              onClick={() =>
                showNotification("Edit profile feature opened", "info")
              }
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
            <button
              className="action-btn secondary-btn"
              onClick={() =>
                showNotification("Password change feature opened", "info")
              }
            >
              <i className="fas fa-key"></i> Change Password
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBackup = () => {
    return (
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Database Backup</h3>
            <i className="fas fa-database"></i>
          </div>
          <div className="card-value">2.5 GB</div>
          <p style={{ marginBottom: "15px" }}>Last backup: Today, 2:30 AM</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "100%" }}></div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              className="action-btn primary-btn"
              style={{ flex: 1 }}
              onClick={() => showNotification("Backup downloaded", "success")}
            >
              <i className="fas fa-download"></i> Download
            </button>
            <button
              className="action-btn success-btn"
              style={{ flex: 1 }}
              onClick={() => showNotification("Backup started", "info")}
            >
              <i className="fas fa-sync"></i> Backup Now
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Backup History</h3>
            <i className="fas fa-history"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>Feb 1, 2024 - 2:30 AM</span>
              <span className="badge success">Success</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>Jan 31, 2024 - 2:30 AM</span>
              <span className="badge success">Success</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <span>Jan 30, 2024 - 2:30 AM</span>
              <span className="badge success">Success</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Auto-Backup Settings</h3>
            <i className="fas fa-clock"></i>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label>Frequency</label>
              <select onChange={() => {}}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" defaultValue="02:30" onChange={() => {}} />
            </div>
            <div className="form-group">
              <label>Retention</label>
              <select onChange={() => {}}>
                <option>Last 7 backups</option>
                <option>Last 30 backups</option>
                <option>Last 90 backups</option>
              </select>
            </div>
            <button
              className="action-btn primary-btn"
              onClick={() =>
                showNotification("Backup settings saved", "success")
              }
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLogs = () => {
    const logs = [
      {
        timestamp: "2024-02-01 10:30:25",
        user: "admin@achievex.com",
        action: "Added new achievement",
        ip: "192.168.1.1",
      },
      {
        timestamp: "2024-02-01 09:15:10",
        user: "john.doe@achievex.com",
        action: "Logged in",
        ip: "192.168.1.2",
      },
      {
        timestamp: "2024-02-01 08:45:33",
        user: "jane.smith@achievex.com",
        action: "Viewed certificate",
        ip: "192.168.1.3",
      },
      {
        timestamp: "2024-02-01 07:20:18",
        user: "system",
        action: "Daily backup completed",
        ip: "127.0.0.1",
      },
      {
        timestamp: "2024-01-31 23:45:12",
        user: "teacher@achievex.com",
        action: "Verified achievement",
        ip: "192.168.1.4",
      },
    ];

    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Activity Logs</h2>
          <div className="table-actions">
            <button
              className="action-btn secondary-btn"
              onClick={() => showNotification("Logs exported", "success")}
            >
              <i className="fas fa-download"></i> Export
            </button>
            <button
              className="action-btn danger-btn"
              onClick={() => {
                if (window.confirm("Clear all logs?")) {
                  showNotification("Logs cleared", "success");
                }
              }}
            >
              <i className="fas fa-trash"></i> Clear
            </button>
          </div>
        </div>

        <div className="filter-section">
          <select className="filter-select" onChange={() => {}}>
            <option>All Events</option>
            <option>User Actions</option>
            <option>System Events</option>
            <option>Security Events</option>
          </select>
          <select className="filter-select" onChange={() => {}}>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <select className="filter-select" onChange={() => {}}>
            <option>All Users</option>
            <option>Admin</option>
            <option>Students</option>
            <option>Teachers</option>
          </select>
          <button
            className="action-btn primary-btn"
            onClick={() => showNotification("Filters applied", "success")}
          >
            Apply Filters
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.timestamp}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>
                  <code>{log.ip}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ===== MAIN RENDER =====
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "analytics":
        return renderAnalytics();
      case "achievements":
        return renderAchievements();
      case "students":
        return renderStudents();
      case "teachers":
        return renderTeachers();
      case "events":
        return renderEvents();
      case "reports":
        return renderReports();
      case "messages":
        return renderMessages();
      case "settings":
        return renderSettings();
      case "profile":
        return renderProfile();
      case "backup":
        return renderBackup();
      case "logs":
        return renderLogs();
      default:
        return renderDashboard();
    }
  };

  // ===== MODAL CONTENT =====
  const renderModalContent = () => {
    switch (modalType) {
      case "achievement":
        return (
          <>
            <div className="form-group">
              <label>Student</label>
              <select
                name="student"
                value={formData.student || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} - {s.grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Achievement Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="e.g., Chess Tournament Winner"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
              >
                <option>Sports</option>
                <option>Academic</option>
                <option>Cultural</option>
                <option>Technology</option>
              </select>
            </div>
            <div className="form-group">
              <label>Recognition</label>
              <select
                name="recognition"
                value={formData.recognition || ""}
                onChange={handleInputChange}
              >
                <option>Gold</option>
                <option>Silver</option>
                <option>Bronze</option>
                <option>Participation</option>
              </select>
            </div>
          </>
        );

      case "student":
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="student@example.com"
              />
            </div>
            <div className="form-group">
              <label>Grade</label>
              <select
                name="grade"
                value={formData.grade || ""}
                onChange={handleInputChange}
              >
                <option>9th</option>
                <option>10th</option>
                <option>11th</option>
                <option>12th</option>
              </select>
            </div>
          </>
        );

      case "teacher":
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Enter teacher name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="teacher@achievex.com"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department || ""}
                onChange={handleInputChange}
              >
                <option>Science</option>
                <option>Mathematics</option>
                <option>Computer Science</option>
                <option>Arts</option>
              </select>
            </div>
          </>
        );

      case "event":
        return (
          <>
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="e.g., Science Fair 2024"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue || ""}
                onChange={handleInputChange}
                placeholder="Enter venue"
              />
            </div>
          </>
        );

      case "message":
        return (
          <>
            <div className="form-group">
              <label>To</label>
              <select name="to" onChange={handleInputChange}>
                <option>All Students</option>
                <option>All Teachers</option>
                <option>All Parents</option>
                <option>Select Individual</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Type your message..."
                rows="5"
                onChange={handleInputChange}
              ></textarea>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        userType="admin"
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        menuItems={menuItems.admin}
        className={sidebarActive ? "active" : ""}
      />

      <div className="main-content">
        <TopBar
          userType="admin"
          userName="Admin"
          userEmail="admin@achievex.com"
          onLogout={onLogout}
          onMenuClick={toggleSidebar}
        />

        <h1 id="adminPageTitle" style={{ display: "none" }}>
          Dashboard
        </h1>
        {renderContent()}
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`${editingId ? "Edit" : "Add"} ${modalType}`}
      >
        {renderModalContent()}
        <button className="submit-btn" onClick={handleSubmit}>
          {editingId ? "Update" : "Save"} {modalType}
        </button>
      </Modal>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
