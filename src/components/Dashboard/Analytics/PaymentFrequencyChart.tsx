import React from "react";

const frequencyData = [
  {
    title: "Daily",
    transactions: "1.2k",
    percent: 25,
  },
  {
    title: "Weekly",
    transactions: "2.5k",
    percent: 50,
  },
  {
    title: "Monthly",
    transactions: "3.8k",
    percent: 70,
  },
  {
    title: "Yearly",
    transactions: "450",
    percent: 10,
  },
  {
    title: "One-Time",
    transactions: "980",
    percent: 18,
  },
];

const PaymentFrequencyChart: React.FC = () => {
  return (
    <div className="mb-4 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:mb-0 md:p-6 xl:p-7.5">
      {/* Header */}
      <div className="mb-6.5 flex items-center justify-between">
        <div>
          <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
            Payment Frequency
          </h3>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-10 py-2">
          <div className="col-span-6">
            <p className="text-body-sm font-medium">Frequency</p>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-2">
            <p className="text-right text-body-sm font-medium">Transactions</p>
          </div>
        </div>

        {/* Data Rows */}
        {frequencyData.map((item, index) => (
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
            <div className="col-span-2"></div>
            <div className="col-span-2">
              <p className="text-right text-body-sm font-medium text-dark dark:text-dark-6">
                {item.transactions}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentFrequencyChart;
