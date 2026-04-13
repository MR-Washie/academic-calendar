"use client";
import { useEffect, useState } from "react";
import CalendarTable from "@/components/CalendarTable";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return <CalendarTable data={data} />;
}