import React, { useState, useEffect } from "react";
import Sidebar from "../layouts/Sidebar";
import TopBar from "../layouts/TopBar";
import Card from "../common/Card";
import Notification from "../common/Notification";
import { showNotification } from "../utils/helpers";
import "./Dashboard.css";

const ParentDashboard = ({ onLogout }) => {
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

  const parentMenu = [
    {
      category: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "fas fa-home" },
        {
          id: "children",
          label: "My Children",
          icon: "fas fa-child",
          count: "2",
        },
        { id: "achievements", label: "Achievements", icon: "fas fa-trophy" },
        {
          id: "attendance",
          label: "Attendance",
          icon: "fas fa-calendar-check",
        },
        { id: "grades", label: "Grades", icon: "fas fa-chart-line" },
      ],
    },
  ];

  const renderDashboard = () => {
    return (
      <>
        <div className="cards-container">
          <Card title="My Children" value="2" icon="fas fa-child" />
          <Card title="Total Achievements" value="20" icon="fas fa-trophy" />
          <Card title="Average GPA" value="4.7" icon="fas fa-star" />
        </div>

        <div className="achievement-grid">
          <div
            className="achievement-card"
            onClick={() => showNotification("Viewing John's profile", "info")}
          >
            <div className="achievement-icon">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="achievement-title">John Doe</div>
            <p>Grade 10 • 8 achievements</p>
            <span className="badge success">Active</span>
          </div>
          <div
            className="achievement-card"
            onClick={() => showNotification("Viewing Jane's profile", "info")}
          >
            <div className="achievement-icon">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="achievement-title">Jane Doe</div>
            <p>Grade 8 • 12 achievements</p>
            <span className="badge success">Active</span>
          </div>
        </div>
      </>
    );
  };

  const renderChildren = () => {
    return (
      <div className="achievement-grid">
        <div className="achievement-card">
          <h3>John Doe</h3>
          <p>Grade 10 • Achievements: 8</p>
          <button
            className="action-btn primary-btn"
            onClick={() => showNotification("Viewing details", "info")}
          >
            View Details
          </button>
        </div>
        <div className="achievement-card">
          <h3>Jane Doe</h3>
          <p>Grade 8 • Achievements: 12</p>
          <button
            className="action-btn primary-btn"
            onClick={() => showNotification("Viewing details", "info")}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    return (
      <div className="table-container">
        <h2>Achievements - John Doe</h2>
        <table>
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Recognition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chess Champion</td>
              <td>Sports</td>
              <td>2024-01-15</td>
              <td>
                <span className="badge gold">Gold</span>
              </td>
            </tr>
            <tr>
              <td>Science Fair</td>
              <td>Academic</td>
              <td>2023-12-10</td>
              <td>
                <span className="badge silver">Silver</span>
              </td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ marginTop: "30px" }}>Achievements - Jane Doe</h2>
        <table>
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Recognition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Art Competition</td>
              <td>Cultural</td>
              <td>2024-01-10</td>
              <td>
                <span className="badge gold">Gold</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderAttendance = () => {
    return (
      <div className="table-container">
        <h2>Attendance Report</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Present</th>
              <th>Total</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>38</td>
              <td>40</td>
              <td>95%</td>
            </tr>
            <tr>
              <td>Jane Doe</td>
              <td>42</td>
              <td>42</td>
              <td>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderGrades = () => {
    return (
      <div className="table-container">
        <h2>Grade Report</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Programming</td>
              <td>A (95%)</td>
            </tr>
            <tr>
              <td>John Doe</td>
              <td>Calculus</td>
              <td>B+ (88%)</td>
            </tr>
            <tr>
              <td>Jane Doe</td>
              <td>Mathematics</td>
              <td>A+ (98%)</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "children":
        return renderChildren();
      case "achievements":
        return renderAchievements();
      case "attendance":
        return renderAttendance();
      case "grades":
        return renderGrades();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        userType="parent"
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        menuItems={parentMenu}
        className={sidebarActive ? "active" : ""}
      />
      <div className="main-content">
        <TopBar
          userType="parent"
          userName="Robert Doe"
          userEmail="parent@achievex.com"
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

export default ParentDashboard;
