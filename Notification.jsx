import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <i
        className={`fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}`}
      ></i>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
