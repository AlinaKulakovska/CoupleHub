import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TimeElapsedWidget = () => {
  const { user } = useContext(AuthContext);
  const [timeElapsed, setTimeElapsed] = useState("");
  const coupleData = user?.couple;
  const anniversary = coupleData?.anniversaryDate;

    const pastDate = new Date(anniversary);

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date();

      let years = now.getFullYear() - pastDate.getFullYear();
      let months = now.getMonth() - pastDate.getMonth();
      let days = now.getDate() - pastDate.getDate();

      // Adjust for negative days (borrow from previous month)
      if (days < 0) {
        // Get the last day of the previous month
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
        months--;
      }

      // Adjust for negative months (borrow from previous year)
      if (months < 0) {
        months += 12;
        years--;
      }

      // Pluralization helpers
      const yText = `${years} ${years === 1 ? "year" : "years"}`;
      const mText = `${months} ${months === 1 ? "month" : "months"}`;
      const dText = `${days} ${days === 1 ? "day" : "days"}`;

      setTimeElapsed(`${yText}, ${mText} and ${dText}`);
    };

    // Calculate immediately on mount
    calculateElapsed();

    // Check for updates every hour (since we only care about days/months/years)
    const timer = setInterval(calculateElapsed, 3600000);

    return () => clearInterval(timer);
  }, []);

  return <>{timeElapsed}</>;
};

export default TimeElapsedWidget;
