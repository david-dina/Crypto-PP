"use client"
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ModalTwo from "@/components/Modals/ModalTwo";
import DropdownEdit from "@/components/Dropdowns/DropdownEdit";

const ChartSix: React.FC = () => {
  // ----------------------------
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ----------------------------
  // FINAL DATA STRUCTURE for subscriptions
  const subscriptions = [
    {
      value: "sub_123", // Subscription ID
      label: "Basic Subscription", // Display Name
      data: [30, 40, 50, 60, 70, 75, 80, 85, 90, 100, 110, 120], // Chart Data
    },
    {
      value: "sub_456", // Subscription ID
      label: "Premium Subscription", // Display Name
      data: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    },
    {
      value: "sub_789", // Subscription ID
      label: "Pro Subscription", // Display Name
      data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 350],
    },
  ];

  // ----------------------------
  // Chart Data and State
  const [series, setSeries] = useState([
    {
      name: "Basic Plan",
      data: [30, 40, 50, 60, 70, 75, 80, 85, 90, 100, 110, 120],
    },
    {
      name: "Premium Plan",
      data: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    },
    {
      name: "Pro Plan",
      data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200],
    },
  ]);

  // ----------------------------
  // Dynamic Stats Calculation
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    // Calculate total revenue
    const allData = series.flatMap((s) => s.data); // Combine all data points
    const currentTotal = allData.reduce((acc, value) => acc + value, 0); // Total revenue
    const previousTotal = allData
      .slice(0, allData.length - 1) // Exclude last point for percentage
      .reduce((acc, value) => acc + value, 0);

    // Calculate percentage change
    const change = ((currentTotal - previousTotal) / previousTotal) * 100 || 0;

    setTotalRevenue(currentTotal.toFixed(2)); // Format revenue
    setPercentageChange(change.toFixed(1)); // Format percentage change
  }, [series]);

  // ----------------------------
  // Chart Configuration
  const options = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9", "#FF6384"], // Keep original colors
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 250,
      type: "area",
      toolbar: { show: false },
    },
    fill: {
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 300 } } },
      { breakpoint: 1366, options: { chart: { height: 320 } } },
    ],
    stroke: { width: [2, 2], curve: "smooth" },
    markers: { size: 0 },
    grid: {
      strokeDashArray: 7,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories: [
        "Sep", "Oct", "Nov", "Dec", "Jan", "Feb",
        "Mar", "Apr", "May", "Jun", "Jul", "Aug",
      ],
    },
    yaxis: { title: { style: { fontSize: "0px" } } },
  };

  // ----------------------------
  // Handle Chart Updates from Modal
  const handleUpdateChart = (selectedPlans: string[]) => {
    const updatedSeries = selectedPlans.map((id) => {
      const selectedPlan = subscriptions.find((sub) => sub.value === id);
      return {
        name: selectedPlan?.label || "Unknown Plan", // Display name
        data: selectedPlan?.data || [], // Chart data
      };
    });

    setSeries(updatedSeries); // Update the chart
  };

  // ----------------------------
  // Component Return
  return (
    <div className="col-span-12 rounded-[10px] bg-white px-6 pb-5 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:px-7.5 xl:col-span-7">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Subscriptions
          </h4>
          <div className="mt-2.5 flex gap-3">
            <h3 className="text-heading-5 font-bold leading-[34px] text-dark dark:text-white">
              ${totalRevenue} {/* Dynamic Revenue */}
            </h3>
            <span
              className={`flex items-center gap-1 text-body-sm font-medium ${
                percentageChange >= 0 ? "text-green" : "text-red"
              }`}
            >
              <svg
                className="fill-current"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.9027 5.54395C10.9027 5.2678 11.1265 5.04395 11.4027 5.04395H15.1241C15.4002 5.04395 15.6241 5.2678 15.6241 5.54395V9.24117C15.6241 9.51731 15.4002 9.74117 15.1241 9.74117C14.848 9.74117 14.6241 9.51731 14.6241 9.24117V6.74585L10.5335 10.8115Z"
                  fill=""
                />
              </svg>
              {percentageChange}%
            </span>
          </div>
        </div>
        <DropdownEdit onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Chart */}
      <ReactApexChart options={options} series={series} type="area" height={250} />

      {/* Modal */}
      <ModalTwo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateChart={handleUpdateChart}
        subscriptions={subscriptions}
      />
    </div>
  );
};

export default ChartSix;
