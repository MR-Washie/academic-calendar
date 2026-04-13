"use client";
import { useState } from "react";

export default function AdminPage() {
  const [form, setForm] = useState({
    activity: "",
    for: "",
    date: "",
    remarks: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Add Academic Event</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Activity"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, activity: e.target.value })}
        />

        <input
          placeholder="For"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, for: e.target.value })}
        />

        <input
          placeholder="Date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Remarks"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        <button className="bg-green-600 text-white px-4 py-2">
          Add Event
        </button>
      </form>
    </div>
  );
}