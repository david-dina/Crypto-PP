import React, { useState, useEffect } from "react";

type SwitcherFourProps = {
  active?: boolean;
  onToggle?: (newState: boolean) => void;
  id: string; // Unique ID for each switcher
};

const SwitcherFour: React.FC<SwitcherFourProps> = ({ active = false, onToggle, id }) => {
  const [enabled, setEnabled] = useState<boolean>(active);

  useEffect(() => {
    if (active !== undefined && active !== null) {
      setEnabled(active);
    }
  }, [active]);

  const handleChange = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={enabled}
            onChange={handleChange}
          />
          <div
            className={`block h-8 w-14 rounded-full ${!enabled ? "bg-[#c3ddf8] dark:bg-gray-5" : "bg-primary"}`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled ? "!right-1 !translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherFour;

