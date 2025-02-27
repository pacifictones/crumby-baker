import { useState, useEffect } from "react";

const CookModeToggle = () => {
  const [isCookModeOn, setIsCookModeOn] = useState(false);

  useEffect(() => {
    let wakeLock = null;

    const enableWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request("screen");
          console.log("Wake Lock enabled", wakeLock);
        } catch (err) {
          console.error("Failed to enable Wake Lock:", err);
        }
      } else {
        console.warn("Wake Lock API is not supprted in this browser.");
      }
    };

    const disableWakeLock = () => {
      if (wakeLock) {
        wakeLock.release().then(() => {
          console.log("Wake Lock released");
          wakeLock = null;
        });
      }
    };

    if (isCookModeOn) {
      enableWakeLock();
    } else {
      disableWakeLock();
    }

    return () => disableWakeLock();
  }, [isCookModeOn]);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2 text-center">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isCookModeOn}
          onChange={() => setIsCookModeOn(!isCookModeOn)}
        />
        {/* Toggle Switch Background */}
        <div className="w-11 h-6 bg-gray-300 rounded-full p-1 flex items-center transition-all duration-300">
          {/* Moving Circle */}
          <div
            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
              isCookModeOn
                ? "translate-x-5 bg-[#ED6A5A]" // Red when on
                : "translate-x-0 bg-white" // White when off
            }`}
          ></div>
        </div>
        <span className="ml-2 font-semibold font-heading text-lg">
          Cook Mode
        </span>
      </label>
      <span className="sm:ml-2 text-gray-500 text-sm text-left sm:text-base font-body sm:whitespace-nowrap">
        Prevent your screen from dimming
      </span>
    </div>
  );
};

export default CookModeToggle;
