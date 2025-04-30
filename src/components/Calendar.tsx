import { useState } from "react";
//Styling
import "./Calendar.scss";

const Calendar = () => {
  return (
    <div className="custom-calendar">
      {/* Header */}
      <div className="custom-calendar-header">
        <button>&larr;</button>
        <span>April 2025</span>
        <button>&rarr;</button>
      </div>

      {/* Weekday Labels */}
      <div className="custom-calendar-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="custom-calendar-grid">
        {Array.from({ length: 42 }, (_, i) => (
          <div key={i} className="custom-calendar-cell">
            {/* We'll put actual numbers here later */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
