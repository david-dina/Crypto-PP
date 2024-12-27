import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import GraphDatasetModal from "@/components/Modals/ModalAnalytics";
import DropdownEdit from "@/components/Dropdowns/DropdownEdit";

const RevenueTransactionGraph: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [series, setSeries] = useState([
    {
      name: "Total Revenue",
      data: [2000, 2500, 3200, 4000, 4500, 5000, 6000, 5500, 7000, 7500, 8000, 8500],
    },
    {
      name: "Total Transactions",
      data: [150, 200, 250, 300, 350, 400, 450, 420, 500, 550, 600, 650],
    },
  ]);

  const handleApply = (selectedDatasets) => {
    const updatedSeries = selectedDatasets.map((dataset) => ({
      name: dataset.label, // Dataset name
      data: dataset.data,  // Dataset values
    }));
  
    setSeries(updatedSeries); // Update the chart data
  };


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
            Revenue and Transactions
          </h4>
        </div>
        <DropdownEdit onClick={() => setIsModalOpen(true)} />
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
      <GraphDatasetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
      />
    </div>
  );
};

export default RevenueTransactionGraph;
