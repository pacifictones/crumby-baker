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
    <div className="flex items-center space-x-2">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isCookModeOn}
          onChange={() => setIsCookModeOn(!isCookModeOn)}
        />
        {/* Toggle Switch Background */}
        <div className="w-10 h-5 bg-gray-300 rounded-full p-1 flex items-center transition-all duration-300 relative">
          {/* Moving Circle */}
          <div
            className={`w-4 h-4 rounded-full shadow-md transition-all duration-300 absolute top-0.5 left-0.5 ${
              isCookModeOn
                ? "translate-x-5 bg-[#ED6A5A]"
                : "translate-x-0 bg-white"
            }`}
          ></div>
        </div>
        <span className="ml-2 font-semibold font-heading text-lg">
          Cook Mode
        </span>
        <span className="ml-1 text-gray-500 text-sm font-body">
          Prevent your screen from dimming
        </span>
      </label>
    </div>
  );
};

export default CookModeToggle;
