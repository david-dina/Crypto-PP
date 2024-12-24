import React from "react";
import { TopData } from "@/types/topData";

const contentList = [
  {
    title: "13 - 17",
    listeners: "2.5k",
    percent: 15,
  },
  {
    title: "18 - 24",
    listeners: "468",
    percent: 43,
  },
  {
    title: "18 - 24",
    listeners: "376",
    percent: 50,
  },
  {
    title: "25 - 40",
    listeners: "179",
    percent: 27,
  },
  {
    title: "40 - 50",
    listeners: "298",
    percent: 16,
  },
  {
    title: "51+",
    listeners: "298",
    percent: 6,
  },
];

const AgesChart: React.FC<TopData> = () => {
  return (
    <div className="mb-4 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:mb-0 md:p-6 xl:p-7.5">
      <div className="mb-6.5 flex items-center justify-between">
        <div>
          <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
            Listeners by Age
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-10 py-2">
          <div className="col-span-6">
            <p className="text-body-sm font-medium">Age Group</p>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-2">
            <p className="text-right text-body-sm font-medium">Listeners</p>
          </div>
        </div>

        {contentList.map((item, index) => (
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
                {item.listeners}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgesChart;
