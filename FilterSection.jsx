import React from "react";
import "./FilterSection.css";

const FilterSection = ({ onSearch, filters, onFilterChange }) => {
  return (
    <div className="filter-section">
      <input
        type="text"
        className="search-box"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
      />
      {filters.map((filter, idx) => (
        <select
          key={idx}
          className="filter-select"
          onChange={(e) => onFilterChange(filter.name, e.target.value)}
        >
          <option value="all">{filter.placeholder}</option>
          {filter.options.map((option, optIdx) => (
            <option key={optIdx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <button
        className="action-btn primary-btn"
        onClick={() => onFilterChange("apply", null)}
      >
        <i className="fas fa-filter"></i> Apply
      </button>
    </div>
  );
};

export default FilterSection;
