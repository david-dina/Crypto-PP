import React from "react";
import { CardItemProps } from "@/types/cards";
import dynamic from "next/dynamic";

// Dynamically import charts (optional)
const MiniChart = dynamic(() => import("@/components/Charts/ChartOne"), {
  ssr: false,
});

const CardsItemOne: React.FC<CardItemProps> = ({
  title,
  amount,
  percentage,
  chartData, // Optional prop for mini charts
}) => {
  // Determine percentage color
  const percentageColor =
    percentage && percentage.includes("-") ? "text-red-500" : "text-green-500";

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-lg dark:bg-gray-dark dark:shadow-card">
      {/* Title */}
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </h4>

      {/* Amount */}
      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          {amount}
        </h2>
        <span className={`text-sm font-medium ${percentageColor}`}>
          {percentage}
        </span>
      </div>

      {/* Chart Placeholder */}
      {chartData && (
        <div className="mt-4 h-20">
          <MiniChart data={chartData} />
        </div>
      )}
    </div>
  );
};

export default CardsItemOne;
