"use client";

import { useEffect, useState } from "react";

export const useTimeout = (seconds: number) => {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), seconds);

    return () => clearTimeout(timer);
  }, [seconds]);

  return { timeoutReached, setTimeoutReached };
};
