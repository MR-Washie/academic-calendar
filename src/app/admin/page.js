"use client";

import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState("");

  const [title, setTitle] = useState("");
  const [academicActivity, setAcademicActivity] = useState("");
  const [program, setProgram] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const res = await fetch("/api/calendar");

      if (!res.ok) throw new Error("Failed to fetch calendars");

      const data = await res.json();
      setCalendars(data);
    } catch (error) {
      console.error(error);
      setMsg("Error loading calendars");
    }
  };

  const addCalendar = async () => {
    if (!title) return setMsg("Enter calendar title");

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add calendar");
      }

      setMsg("Calendar added");
      setTitle("");
      fetchCalendars();
    } catch (error) {
      console.error(error);
      setMsg("Error adding calendar");
    }
  };

  const removeCalendar = async (id) => {
    try {
      const res = await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.error || "Failed to remove calendar");
        return;
      }

      setMsg("Calendar removed");
      fetchCalendars();

      if (String(selectedCalendar) === String(id)) {
        setSelectedCalendar("");
      }
    } catch (error) {
      console.log("Error in remove calendar:", error);
      setMsg("Error removing calendar");
    }
  };

  const addEvent = async () => {
    if (!selectedCalendar) return setMsg("Select calendar");
    if (!academicActivity) return setMsg("Enter academic activity");

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendar_id: Number(selectedCalendar),
          academic_activity: academicActivity,
          program,
          start_date: startDate,
          end_date: endDate,
          remarks,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add event");
      }

      setMsg("Event added");
      setAcademicActivity("");
      setProgram("");
      setStartDate("");
      setEndDate("");
      setRemarks("");
    } catch (error) {
      console.error(error);
      setMsg("Error adding event");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "650px", margin: "auto" }}>
      <h2>Academic Calendar Admin</h2>

      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>Add Calendar</h3>

        <input
          type="text"
          placeholder="Calendar Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <button onClick={addCalendar} style={{ marginTop: "10px" }}>
          Add Calendar
        </button>

        <div style={{ marginTop: "20px" }}>
          <h3>Calendar List</h3>

          {calendars.length === 0 ? (
            <p>No calendars found</p>
          ) : (
            calendars.map((cal) => (
              <div
                key={cal.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <span>{cal.title}</span>

                <button
                  onClick={() => removeCalendar(cal.id)}
                  style={{ background: "red", color: "white", border: "none", padding: "6px 10px" }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "15px" }}>
        <h3>Add Event</h3>

        <select
          value={selectedCalendar}
          onChange={(e) => setSelectedCalendar(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">Select Calendar</option>
          {calendars.map((cal) => (
            <option key={cal.id} value={cal.id}>
              {cal.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Academic Activity"
          value={academicActivity}
          onChange={(e) => setAcademicActivity(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Program (UG/PG/PhD)"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <button onClick={addEvent} style={{ marginTop: "10px" }}>
          Add Event
        </button>
      </div>

      <p style={{ marginTop: "15px", color: "green" }}>{msg}</p>
    </div>
  );
}
