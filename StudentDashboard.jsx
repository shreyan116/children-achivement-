import React, { useState, useEffect } from "react";
import Sidebar from "../layouts/Sidebar";
import TopBar from "../layouts/TopBar";
import Card from "../common/Card";
import Notification from "../common/Notification";
import { achievements, menuItems } from "../data/mockData";
import { showNotification } from "../utils/helpers";
import "./Dashboard.css";

const StudentDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("overview");
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

  const registerEvent = () => {
    showNotification("Registered for event successfully!", "success");
  };

  const downloadCertificate = () => {
    showNotification("Downloading certificate...", "success");
  };

  const renderOverview = () => {
    return (
      <>
        <div className="cards-container">
          <Card
            title="My Achievements"
            value="8"
            icon="fas fa-trophy"
            trend={{
              percentage: "80%",
              text: "3 this year",
              color: "var(--success)",
            }}
          />
          <Card
            title="Gold Medals"
            value="3"
            icon="fas fa-crown"
            trend={{
              percentage: "60%",
              text: "Top 10%",
              color: "var(--warning)",
            }}
          />
          <Card
            title="Events"
            value="12"
            icon="fas fa-calendar-check"
            trend={{ percentage: "75%", text: "Active", color: "var(--info)" }}
          />
          <Card
            title="Current GPA"
            value="4.8"
            icon="fas fa-star"
            trend={{
              percentage: "96%",
              text: "Excellent",
              color: "var(--success)",
            }}
          />
        </div>

        <div className="achievement-grid">
          {achievements.slice(0, 4).map((a) => (
            <div
              key={a.id}
              className="achievement-card"
              onClick={() =>
                showNotification("Viewing achievement details", "info")
              }
            >
              <div className="achievement-icon">
                <i
                  className={`fas fa-${a.category === "Sports" ? "trophy" : a.category === "Academic" ? "flask" : "microphone"}`}
                ></i>
              </div>
              <div className="achievement-title">{a.title}</div>
              <div className="achievement-date">{a.date}</div>
              <p>{a.student}</p>
              <div>
                <span className={`badge ${a.recognition.toLowerCase()}`}>
                  {a.recognition}
                </span>
                <span className="badge info">{a.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Upcoming Events</h2>
            <button
              className="action-btn primary-btn"
              onClick={() => handleSectionChange("events")}
            >
              View All
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basketball Tournament</td>
                <td>Feb 15, 2024</td>
                <td>Sports Complex</td>
                <td>
                  <span className="badge success">Open</span>
                </td>
                <td>
                  <button
                    className="action-btn primary-btn"
                    onClick={registerEvent}
                  >
                    Register
                  </button>
                </td>
              </tr>
              <tr>
                <td>Science Exhibition</td>
                <td>Feb 20, 2024</td>
                <td>Science Hall</td>
                <td>
                  <span className="badge success">Open</span>
                </td>
                <td>
                  <button
                    className="action-btn primary-btn"
                    onClick={registerEvent}
                  >
                    Register
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderMyAchievements = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>My Achievements</h2>
          <div className="table-actions">
            <button
              className="action-btn secondary-btn"
              onClick={() =>
                showNotification("Exported successfully!", "success")
              }
            >
              <i className="fas fa-download"></i> Export
            </button>
            <button
              className="action-btn primary-btn"
              onClick={() =>
                showNotification("Profile link copied!", "success")
              }
            >
              <i className="fas fa-share-alt"></i> Share
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Achievement</th>
              <th>Category</th>
              <th>Date</th>
              <th>Recognition</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.category}</td>
                <td>{a.date}</td>
                <td>
                  <span className={`badge ${a.recognition.toLowerCase()}`}>
                    {a.recognition}
                  </span>
                </td>
                <td>
                  <i
                    className="fas fa-download"
                    style={{ color: "var(--primary)", cursor: "pointer" }}
                    onClick={downloadCertificate}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCertificates = () => {
    return (
      <div className="achievement-grid">
        {achievements.slice(0, 3).map((a) => (
          <div key={a.id} className="achievement-card">
            <div className="achievement-icon">
              <i className="fas fa-certificate"></i>
            </div>
            <div className="achievement-title">{a.title}</div>
            <div className="achievement-date">Issued: {a.date}</div>
            <p>Certificate ID: CERT00{a.id}</p>
            <button
              className="action-btn primary-btn"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={downloadCertificate}
            >
              <i className="fas fa-download"></i> Download PDF
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderEvents = () => {
    return (
      <div className="achievement-grid">
        {[
          {
            name: "Chess Tournament",
            date: "Feb 15, 2024",
            venue: "Auditorium",
            status: "Open",
            icon: "fa-chess",
          },
          {
            name: "Science Fair",
            date: "Feb 20, 2024",
            venue: "Science Hall",
            status: "Open",
            icon: "fa-flask",
          },
          {
            name: "Basketball",
            date: "Feb 15, 2024",
            venue: "Sports Complex",
            status: "Limited",
            icon: "fa-basketball-ball",
          },
        ].map((event, idx) => (
          <div key={idx} className="achievement-card">
            <div className="achievement-icon">
              <i className={`fas ${event.icon}`}></i>
            </div>
            <div className="achievement-title">{event.name}</div>
            <div className="achievement-date">{event.date}</div>
            <p>📍 {event.venue}</p>
            <span
              className={`badge ${event.status === "Open" ? "success" : "warning"}`}
            >
              {event.status}
            </span>
            <button
              className="action-btn primary-btn"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={registerEvent}
            >
              Register
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderPortfolio = () => {
    return (
      <div className="table-container">
        <div style={{ textAlign: "center", padding: "30px" }}>
          <div
            className="user-avatar"
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 20px",
              fontSize: "2rem",
            }}
          >
            J
          </div>
          <h2>John Doe</h2>
          <p style={{ color: "var(--gray)", marginBottom: "20px" }}>
            Grade 10 Student | Tech Enthusiast | Debater
          </p>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">8</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Gold</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.8</div>
              <div className="stat-label">GPA</div>
            </div>
          </div>

          <h3 style={{ margin: "30px 0 15px" }}>Skills</h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span className="badge gold">Python</span>
            <span className="badge silver">JavaScript</span>
            <span className="badge bronze">Public Speaking</span>
            <span className="badge success">Leadership</span>
          </div>

          <button
            className="action-btn primary-btn"
            style={{ marginTop: "20px" }}
            onClick={() => showNotification("Portfolio editor opened", "info")}
          >
            <i className="fas fa-edit"></i> Edit Portfolio
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "myAchievements":
        return renderMyAchievements();
      case "certificates":
        return renderCertificates();
      case "events":
        return renderEvents();
      case "portfolio":
        return renderPortfolio();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        userType="student"
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        menuItems={menuItems.student}
        className={sidebarActive ? "active" : ""}
      />
      <div className="main-content">
        <TopBar
          userType="student"
          userName="John Doe"
          userEmail="john.doe@achievex.com"
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

export default StudentDashboard;
