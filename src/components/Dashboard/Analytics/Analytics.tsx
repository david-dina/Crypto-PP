"use client";
import React, { useEffect, useState } from "react";
import DatepickerBox from "@/components/DatepickerBox";
import MonthlyDatepicker from "@/components/MonthlyDatepicker";
import StreamGraph from "./StreamGraph";
import Stats from "./Stats";
import TopPlans from "./TopPlans";
import PaymentMethodsChart from "./PaymentMethodsChart";
import PaymentFrequencyChart from "./PaymentFrequencyChart";

const Analytics: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-3">
          <DatepickerBox />
        </div>
        <Stats />
        <StreamGraph />
        <div className="col-span-12 xl:col-span-6">
          {/* <!-- ====== Top Content Star --> */}
          <TopPlans />
          {/* <!-- ====== Top Content End --> */}

          {/* <!-- ====== Top Channels Star --> */}
          <PaymentFrequencyChart />
          {/* <!-- ====== Top Channels End --> */}
        </div>
        <PaymentMethodsChart />
      </div>
    </>
  );
};

export default Analytics;
