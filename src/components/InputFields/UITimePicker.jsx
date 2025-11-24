"use client";

import React, { useState, useEffect } from "react";
import UITypography from "../UITypography/UITypography";

export const UITimePicker = ({ time, setTime, labelName }) => {
  const [hours, setHours] = useState("10");
  const [minutes, setMinutes] = useState("00");
  const [period, setPeriod] = useState("AM");

  // Parse incoming time prop once on mount
  useEffect(() => {
    if (time) {
      const [h, m] = time.split(":");
      const hour = parseInt(h);
      const newPeriod = hour >= 12 ? "PM" : "AM";
      const newHour = hour % 12 || 12;
      setHours(String(newHour).padStart(2, "0"));
      setMinutes(m);
      setPeriod(newPeriod);
    }
  }, []); // Only on mount

  // Convert 12-hour to 24-hour and update parent only when local state changes
  useEffect(() => {
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    const formattedHour = String(hour).padStart(2, "0");
    const formattedTime = `${formattedHour}:${minutes}`;
    setTime(formattedTime);
  }, [hours, minutes, period, setTime]); // Only when local state changes

  return (
    <div className="flex flex-col gap-2">
      {labelName && (
        <UITypography variant="h6" text={labelName} className="!text-[14px]" />
      )}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="1"
          max="12"
          value={hours}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setHours("");
            else setHours(String(Math.min(12, Math.max(1, parseInt(val)))).padStart(2, "0"));
          }}
          className="w-16 px-2 py-2 border border-gray-300 rounded"
          placeholder="HH"
        />
        <span className="text-xl font-bold">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setMinutes("");
            else setMinutes(String(Math.min(59, Math.max(0, parseInt(val)))).padStart(2, "0"));
          }}
          className="w-16 px-2 py-2 border border-gray-300 rounded"
          placeholder="MM"
        />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded bg-white cursor-pointer"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <p className="text-sm text-gray-600">
        24-hour format: {time || "HH:MM"}
      </p>
    </div>
  );
};

export default UITimePicker;