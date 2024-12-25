"use client";
import React from "react";

type Option = {
  value: string;
  label: string;
};

type SelectGroupOneProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
};

const SelectGroupOne: React.FC<SelectGroupOneProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  const isOptionSelected = value !== "";

  return (
    <div className="mb-4.5">
      <label
        htmlFor={name}
        className="mb-2.5 block font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative z-20 bg-transparent dark:bg-dark-2">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${
            isOptionSelected ? "text-dark dark:text-white" : "text-gray-400"
          }`}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-dark-6"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.99922 12.8249C8.83047 12.8249 8.68984 12.7687 8.54922 12.6562L2.08047 6.2999C1.82734 6.04678 1.82734 5.65303 2.08047 5.3999C2.33359 5.14678 2.72734 5.14678 2.98047 5.3999L8.99922 11.278L15.018 5.34365C15.2711 5.09053 15.6648 5.09053 15.918 5.34365C16.1711 5.59678 16.1711 5.99053 15.918 6.24365L9.44922 12.5999C9.30859 12.7405 9.16797 12.8249 8.99922 12.8249Z"
              fill=""
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupOne;
