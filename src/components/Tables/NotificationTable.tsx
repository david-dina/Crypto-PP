import { Package } from "@/types/package";

const notificationsData: Package[] = [
  {
    name: "Payment Failed",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Unpaid",
  },
  {
    name: "Subscription Renewed",
    price: 99.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Upcoming Payment",
    price: 59.0,
    invoiceDate: `Jan 15,2023`,
    status: "Pending",
  },
];

const NotificationsTable = () => {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h4 className="text-lg font-bold text-dark dark:text-white mb-4">Notifications</h4>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Type
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Date
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notificationsData.map((notification, index) => (
              <tr key={index}>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === notificationsData.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <h5 className="text-dark dark:text-white">
                    {notification.name}
                  </h5>
                  <p className="mt-[3px] text-body-sm font-medium">
                    ${notification.price}
                  </p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === notificationsData.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p className="text-dark dark:text-white">
                    {notification.invoiceDate}
                  </p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === notificationsData.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p
                    className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                      notification.status === "Paid"
                        ? "bg-[#219653]/[0.08] text-[#219653]"
                        : notification.status === "Unpaid"
                          ? "bg-[#D34053]/[0.08] text-[#D34053]"
                          : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                    }`}
                  >
                    {notification.status}
                  </p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === notificationsData.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <div className="flex items-center justify-end space-x-3.5">
                    {//<button className="hover:text-primary">
                     // View
                    //</button>
                    }
                    <button className="hover:text-primary">
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsTable;
