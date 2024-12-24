import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import DropdownDefault from "../../Dropdowns/DropdownDefault";

const StreamGraph: React.FC = () => {
  const series = [
    {
      name: "Total",
      data: [15, 12, 61, 118, 78, 125, 165, 61, 183, 238, 237, 235],
    },

    {
      name: "Unique",
      data: [75, 77, 151, 72, 7, 58, 60, 185, 239, 135, 119, 124],
    },
  ];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 380,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },

    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 7,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-6 pb-5 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-heading-5 font-bold text-dark dark:text-white">
            Song Streams
          </h4>
        </div>
        <DropdownDefault />
      </div>
      <div>
        <div id="chartSix" className="-ml-3.5 -mr-4">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={380}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamGraph;
