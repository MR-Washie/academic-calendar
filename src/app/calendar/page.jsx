"use client";

import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [events, setEvents] = useState([]);

  const [academicActivity, setAcademicActivity] = useState("");
  const [program, setProgram] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const [msg, setMsg] = useState("");

  // ✅ FETCH CALENDARS
  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then(setCalendars)
      .catch(() => setMsg("Error loading calendars"));
  }, []);

  // ✅ FETCH EVENTS
  const fetchEvents = async (id) => {
    const res = await fetch(`/api/event?calendar_id=${id}`);
    const data = await res.json();
    setEvents(data);
  };

  // ✅ SELECT CALENDAR
  const handleSelectCalendar = (id) => {
    setSelectedCalendar(id);
    fetchEvents(id);
  };

  // ✅ ADD EVENT
  const addEvent = async () => {
    const res = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calendar_id: selectedCalendar,
        academic_activity: academicActivity,
        program,
        start_date: startDate,
        end_date: endDate,
        remarks,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMsg("Event added ✅");
      fetchEvents(selectedCalendar);

      setAcademicActivity("");
      setProgram("");
      setStartDate("");
      setEndDate("");
      setRemarks("");
    } else {
      setMsg(data.error || "Error");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>📅 Academic Calendar</h2>

      {/* CALENDARS LIST */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {calendars.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCalendar(c.id)}
            style={{
              padding: 10,
              border: "1px solid black",
              background: selectedCalendar === c.id ? "#ddd" : "white",
              cursor: "pointer",
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* EVENTS */}
      <div style={{ marginTop: 20 }}>
        <h3>📌 Events</h3>

        {selectedCalendar &&
          events.map((e) => (
            <div key={e.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
              <b>{e.academic_activity}</b>
              <p>{e.program}</p>
              <p>
                {e.start_date} → {e.end_date}
              </p>
              <p>{e.remarks}</p>
            </div>
          ))}
      </div>

      {/* ADD EVENT */}
      {selectedCalendar && (
        <div style={{ marginTop: 20 }}>
          <h3>Add Event</h3>

          <input
            placeholder="Academic Activity"
            value={academicActivity}
            onChange={(e) => setAcademicActivity(e.target.value)}
          />

          <input
            placeholder="Program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />

          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <textarea
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button onClick={addEvent}>Add Event</button>
        </div>
      )}

      <p>{msg}</p>
    </div>
  );
}