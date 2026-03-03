import React from "react";
import "./Card.css";

const Card = ({ title, value, icon, trend, color, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-header">
        <h3>{title}</h3>
        <i className={icon}></i>
      </div>
      <div className="card-value">{value}</div>
      {trend && (
        <>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: trend.percentage }}
            ></div>
          </div>
          <span style={{ color: trend.color }}>{trend.text}</span>
        </>
      )}
    </div>
  );
};

export default Card;
