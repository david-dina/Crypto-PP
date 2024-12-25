import { useState } from "react";
import ClickOutside from "@/components/ClickOutside";

type DropdownEditProps = {
  onClick: () => void; // Accepts an `onClick` prop
};

const DropdownEdit: React.FC<DropdownEditProps> = ({ onClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <div className="relative flex">
        <button
          className="hover:text-primary"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <svg
            className="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 10C3.10457 10 4 9.10457 4 8C4 6.89543 3.10457 6 2 6C0.89543 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10Z" fill="" />
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="" />
            <path d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z" fill="" />
          </svg>
        </button>
        {dropdownOpen && (
          <div
            className={`absolute right-0 top-full z-40 w-46.5 space-y-1.5 rounded-[7px] border border-stroke bg-white p-2 shadow-2 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card`}
          >
            {/* Edit Button */}
            <button
              onClick={() => {
                setDropdownOpen(false); // Close dropdown
                onClick(); // Trigger modal open or callback
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2575_3985)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5779 1.70694C13.6038 0.681022 15.2671 0.681022 16.2931 1.70694C17.319 2.73285 17.319 4.39619 16.2931 5.4221L11.307 10.4082C11.0285 10.6867 10.8541 10.8611 10.6594 11.013C10.4302 11.1918 10.1821 11.3451 9.91961 11.4702C9.69676 11.5764 9.46271 11.6544 9.08909 11.7789L6.9107 12.505C6.50851 12.6391 6.0651 12.5344 5.76533 12.2347C5.46556 11.9349 5.36089 11.4915 5.49495 11.0893L6.22108 8.91092C6.34559 8.53729 6.42359 8.30324 6.5298 8.08039C6.65489 7.81791 6.80821 7.56984 6.98703 7.34056C7.13887 7.1459 7.31333 6.97147 7.59183 6.693L12.5779 1.70694Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2575_3985">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Edit
            </button>
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default DropdownEdit;
