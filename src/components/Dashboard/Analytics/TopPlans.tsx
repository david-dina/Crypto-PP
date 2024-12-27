import React from "react";

const planData = [
  {
    title: "Pro Plan",
    revenue: "$12.5K",
    activeUsers: 150,
    percent: 74,
  },
  {
    title: "Basic Plan",
    revenue: "$5.6K",
    activeUsers: 500,
    percent: 72,
  },
  {
    title: "One-Time Payments",
    revenue: "$8.9K",
    activeUsers: 80,
    percent: 38,
  },
  {
    title: "Annual Premium",
    revenue: "$15.2K",
    activeUsers: 120,
    percent: 45,
  },
  {
    title: "Trial Plan",
    revenue: "$1.2K",
    activeUsers: 50,
    percent: 20,
  },
];

const TopPlans: React.FC = () => {
  return (
    <div className="mb-4 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:mb-6 md:p-6 xl:p-7.5 2xl:mb-7.5">
      <div className="mb-6.5 flex items-center justify-between">
        <div>
          <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
            Top Plans
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-10 py-2">
          <div className="col-span-6">
            <p className="text-body-sm font-medium">Plan</p>
          </div>
          <div className="col-span-2">
            <p className="text-center text-body-sm font-medium">Revenue</p>
          </div>
          <div className="col-span-2">
            <p className="text-right text-body-sm font-medium">Active Users</p>
          </div>
        </div>

        {planData.map((item, index) => (
          <div key={index} className="relative z-1 grid grid-cols-10 py-2">
            <span
              className="absolute left-0 top-0 -z-1 h-full w-[74%] rounded bg-gray-2 dark:bg-dark-2"
              style={{ width: item.percent + "%" }}
            ></span>
            <div className="col-span-6 pl-3.5">
              <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {item.title}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-center text-body-sm font-medium text-dark dark:text-dark-6">
                {item.revenue}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-right text-body-sm font-medium text-dark dark:text-dark-6">
                {item.activeUsers}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPlans;
