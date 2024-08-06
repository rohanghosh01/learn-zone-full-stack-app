'use client'
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
export default function Loader() {
  const [loadingText, setLoadingText] = useState("Loading");
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length < 3) {
        setDots((prevDots) => prevDots + ".");
      } else {
        setDots(".");
        setLoadingText((prevText) =>
          prevText === "Loading" ? "Loading" : prevText + "."
        );
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [dots]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-500 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg dark:bg-gray-800 flex justify-center flex-col items-center content-center">
        <Loader2 className="animate-spin w-8 h-8" />
        <span className="flex text-center">
          {loadingText}
          {dots}
        </span>
      </div>
    </div>
  );
}
