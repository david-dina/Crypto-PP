"use client";
import React, { useEffect, useState } from "react";
import ChartFour from "../../Charts/ChartFour";
import DataStatsTwo from "../../DataStats/DataStatsTwo";
import ChartThree from "../../Charts/ChartThree";
import TopContent from "../../TopContent";
import TopChannels from "../../TopChannels";
import TableTwo from "../../Tables/TableTwo";
import MapTwo from "@/components/Maps/MapTwo";
import DatepickerBox from "@/components/DatepickerBox";
import DefaultSelectOptionTwo from "@/components/SelectOption/DefaultSelectOptionTwo";
import ECommerce from "@/components/Dashboard/E-commerce";
import ChartSix from "../../Charts/ChartSix";
import StreamGraph from "./StreamGraph";
import Stats from "./Stats";
import TopSongs from "./TopSongs";
import GenderChart from "./GenderChart";
import TopAges from "./TopAges";
import AgesChart from "./TopAges";

const Analytics: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-3">
          <DatepickerBox />
        </div>
        <Stats />
        <StreamGraph />

        <MapTwo />
        <div className="col-span-12 xl:col-span-6">
          {/* <!-- ====== Top Content Star --> */}
          <TopSongs />
          {/* <!-- ====== Top Content End --> */}

          {/* <!-- ====== Top Channels Star --> */}
          <AgesChart />
          {/* <!-- ====== Top Channels End --> */}
        </div>
        <GenderChart />
      </div>
    </>
  );
};

export default Analytics;
