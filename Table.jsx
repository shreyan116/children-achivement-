import React from "react";
import "./Table.css";

const Table = ({ headers, data, actions }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {Object.values(row).map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
              {actions && (
                <td className="actions">
                  {actions.map((action, actionIdx) => (
                    <button
                      key={actionIdx}
                      className={`action-btn ${action.className}`}
                      onClick={() => action.onClick(row)}
                    >
                      <i className={action.icon}></i>
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
