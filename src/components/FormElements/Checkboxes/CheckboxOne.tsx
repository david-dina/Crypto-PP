import React from "react";

const CheckboxOne = ({ checked, onChange, label, name }) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="flex cursor-pointer select-none items-center text-body-sm font-medium"
      >
        <div className="relative">
          {/* Checkbox Input */}
          <input
            type="checkbox"
            id={label}
            name={name} // Add name prop
            className="sr-only"
            checked={checked} // Dynamically set checked state
            onChange={onChange} // Trigger change handler
          />
          <div
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
              checked
                ? "border-primary bg-gray-2 dark:bg-transparent"
                : "border-dark-5 dark:border-dark-6"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${
                checked ? "bg-primary" : ""
              }`}
            ></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxOne;
