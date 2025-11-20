import { useEffect, useState } from "react";

const AutoRefreshToggle = ({ interval = 25000, onRefresh }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, interval, onRefresh]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full flex items-center justify-center
        ${enabled ? "bg-green-600 text-white" : "bg-gray-300 text-black"}`}
    >
      <svg
        className="w-6 h-6 text-gray-800"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5"
        />
      </svg>
    </button>
  );
};

export default AutoRefreshToggle;
