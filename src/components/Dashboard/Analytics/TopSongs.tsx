import React from "react";
import { TopData } from "@/types/topData";

const contentList = [
  {
    title: "Song #1",
    streams: "2.5k",
    unique: "2.1k",
    percent: 74,
  },
  {
    title: "Song #3",
    streams: "468",
    unique: "290",
    percent: 55,
  },
  {
    title: "Song #2",
    streams: "376",
    unique: "139",
    percent: 38,
  },
  {
    title: "Song #5",
    streams: "179",
    unique: "57",
    percent: 27,
  },
  {
    title: "Song #4",
    streams: "298",
    unique: "176",
    percent: 20,
  },
];

const TopSongs: React.FC<TopData> = () => {
  return (
    <div className="mb-4 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:mb-6 md:p-6 xl:p-7.5 2xl:mb-7.5">
      <div className="mb-6.5 flex items-center justify-between">
        <div>
          <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
            Top Songs
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-10 py-2">
          <div className="col-span-6">
            <p className="text-body-sm font-medium">Title</p>
          </div>
          <div className="col-span-2">
            <p className="text-center text-body-sm font-medium">Streams</p>
          </div>
          <div className="col-span-2">
            <p className="text-right text-body-sm font-medium">Uniques</p>
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
            <div className="col-span-2">
              <p className="text-center text-body-sm font-medium text-dark dark:text-dark-6">
                {item.streams}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-right text-body-sm font-medium text-dark dark:text-dark-6">
                {item.unique}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSongs;
