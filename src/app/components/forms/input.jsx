import React from "react";

export default function Input({ label, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value); // Send the updated value to the parent
  };
  return (
    <div className="lg:w-1/2 w-full lg:ps-1 mt-2 relative check-input">
      <span className="mb-1 -text-error text-xs error-message absolute -top-4"></span>
      <div className="w-full h-12 rounded-lg bg-gray-700 bg-opacity-50 backdrop-blur-2xl p-2 flex items-center justify-between  -border-error">
        <input
          type="text"
          onChange={handleChange}
          className="w-full border-none bg-transparent outline-none text-sm pt-2 ml-auto text-input"
          data-max="5"
          data-validations="required,persian"
          value={value}
        />
        <label className={value.length >0 ? 'active' : ''}>{label}</label>

        <i className="fi fi-sr-check-circle -text-success hidden error-icon"></i>
        <i className="fi fi-sr-exclamation -text-error hidden success-icon"></i>
      </div>
    </div>
  );
}
