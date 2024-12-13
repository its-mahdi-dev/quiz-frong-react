// components/Select.js
import React from "react";

export default function Select({ label, options, value, onChange}) {
  const handleChange = (e) => {
    onChange(e.target.value); // Pass the selected value to the parent
  };

  return (
    <div className="lg:w-1/2 w-full lg:ps-1 mt-2">
      <select
        className="select select-primary w-full pr-8"
        value={value}
        onChange={handleChange}
      >
      <option disabled>{label}</option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            disabled={option.disabled}
            selected={option.selected}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

