import React, { useState, useEffect } from 'react';

const TimeOfDayWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPeriodText = () => {
    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Afternoon';
    } else if (hour >= 18 && hour < 24) {
      return 'Evening';
    } else {
      return 'Night';
    }
  };

  return (
    <>
      {getPeriodText()}
    </>
  );
};

export default TimeOfDayWidget;