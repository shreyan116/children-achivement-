import React, { useState, useEffect } from "react";
import Sidebar from "../layouts/Sidebar";
import TopBar from "../layouts/TopBar";
import Card from "../common/Card";
import Notification from "../common/Notification";
import { showNotification } from "../utils/helpers";
import "./Dashboard.css";

const TeacherDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarActive, setSidebarActive] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (e) => {
      setNotifications((prev) => [...prev, e.detail]);
    };
    window.addEventListener("notification", handleNotification);
    return () => window.removeEventListener("notification", handleNotification);
  }, []);

  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarActive(false);
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const verifyAchievement = () => {
    showNotification("Achievement verified!", "success");
  };

  const teacherMenu = [
    {
      category: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "fas fa-home" },
        {
          id: "myStudents",
          label: "My Students",
          icon: "fas fa-users",
          count: "45",
        },
        {
          id: "verify",
          label: "Verify Achievements",
          icon: "fas fa-check-circle",
          count: "12",
        },
        {
          id: "classes",
          label: "My Classes",
          icon: "fas fa-chalkboard",
          count: "4",
        },
      ],
    },
  ];

  const renderDashboard = () => {
    return (
      <>
        <div className="cards-container">
          <Card title="My Students" value="45" icon="fas fa-users" />
          <Card title="Pending" value="12" icon="fas fa-clock" />
          <Card title="This Month" value="8" icon="fas fa-calendar" />
          <Card title="Classes" value="4" icon="fas fa-school" />
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Pending Verifications</h2>
            <button
              className="action-btn primary-btn"
              onClick={() => handleSectionChange("verify")}
            >
              View All
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Achievement</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mike Johnson</td>
                <td>Debate Competition</td>
                <td>2024-01-05</td>
                <td className="actions">
                  <button
                    className="action-btn success-btn"
                    onClick={verifyAchievement}
                  >
                    Approve
                  </button>
                  <button className="action-btn danger-btn">Reject</button>
                </td>
              </tr>
              <tr>
                <td>Sarah Wilson</td>
                <td>Art Exhibition</td>
                <td>2024-01-03</td>
                <td className="actions">
                  <button
                    className="action-btn success-btn"
                    onClick={verifyAchievement}
                  >
                    Approve
                  </button>
                  <button className="action-btn danger-btn">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderMyStudents = () => {
    return (
      <div className="table-container">
        <h2>My Students</h2>
        <div className="filter-section">
          <input
            type="text"
            className="search-box"
            placeholder="Search students..."
          />
          <select className="filter-select">
            <option>All Classes</option>
            <option>Grade 10A</option>
            <option>Grade 10B</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Achievements</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>10A</td>
              <td>8</td>
              <td>95%</td>
              <td>
                <button className="action-btn secondary-btn">View</button>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>10A</td>
              <td>12</td>
              <td>98%</td>
              <td>
                <button className="action-btn secondary-btn">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderVerify = () => {
    return (
      <div className="table-container">
        <h2>Verify Achievements</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Recognition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mike Johnson</td>
              <td>Debate Competition</td>
              <td>Cultural</td>
              <td>2024-01-05</td>
              <td>
                <span className="badge bronze">Bronze</span>
              </td>
              <td className="actions">
                <button
                  className="action-btn success-btn"
                  onClick={verifyAchievement}
                >
                  ✓ Approve
                </button>
                <button className="action-btn danger-btn">✗ Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderClasses = () => {
    return (
      <div className="cards-container">
        {["10A", "10B", "11A"].map((cls, idx) => (
          <div
            key={idx}
            className="card"
            onClick={() => showNotification(`Viewing class ${cls}`, "info")}
          >
            <h3>Grade {cls}</h3>
            <p>{idx === 0 ? "24" : idx === 1 ? "21" : "18"} students</p>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "myStudents":
        return renderMyStudents();
      case "verify":
        return renderVerify();
      case "classes":
        return renderClasses();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        userType="teacher"
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        menuItems={teacherMenu}
        className={sidebarActive ? "active" : ""}
      />
      <div className="main-content">
        <TopBar
          userType="teacher"
          userName="Dr. Sarah Wilson"
          userEmail="teacher@achievex.com"
          onLogout={onLogout}
          onMenuClick={toggleSidebar}
        />
        {renderContent()}
      </div>

      <div className="notifications-container">
        {notifications.map((n, i) => (
          <Notification
            key={i}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
