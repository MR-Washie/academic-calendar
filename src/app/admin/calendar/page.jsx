
"use client";

import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [calendars, setCalendars] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const res = await fetch("/api/calendar");
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Failed to fetch calendars");
        return;
      }

      setCalendars(data);
    } catch (error) {
      console.log("Fetch error:", error);
      setMsg("Error loading calendars");
    }
  };

  const addCalendar = async () => {
    if (!title.trim()) {
      setMsg("Enter calendar title");
      return;
    }

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.error || "Failed to add calendar");
        return;
      }

      setMsg("Calendar added successfully");
      setTitle("");
      fetchCalendars();
    } catch (error) {
      console.log("Add error:", error);
      setMsg("Error adding calendar");
    }
  };

  const editCalendar = async (id) => {
    if (!editTitle.trim()) {
      setMsg("Enter updated title");
      return;
    }

    try {
      const res = await fetch("/api/calendar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: editTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.error || "Failed to update calendar");
        return;
      }

      setMsg("Calendar updated successfully");
      setEditId(null);
      setEditTitle("");
      fetchCalendars();
    } catch (error) {
      console.log("Edit error:", error);
      setMsg("Error editing calendar");
    }
  };

  const removeCalendar = async (id) => {
    try {
      const res = await fetch("/api/calendar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.error || "Failed to remove calendar");
        return;
      }

      setMsg("Calendar removed successfully");
      fetchCalendars();
    } catch (error) {
      console.log("Delete error:", error);
      setMsg("Error removing calendar");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px" }}>
      <h2>Calendar Admin</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter calendar title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={addCalendar}
          style={{
            padding: "10px 16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Calendar
        </button>
      </div>

      <h3>Calendar List</h3>

      {calendars.length === 0 ? (
        <p>No calendars found</p>
      ) : (
        calendars.map((cal) => (
          <div
            key={cal.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            {editId === cal.id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                  }}
                />

                <button
                  onClick={() => editCalendar(cal.id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditId(null);
                    setEditTitle("");
                  }}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>{cal.title}</span>

                <div>
                  <button
                    onClick={() => {
                      setEditId(cal.id);
                      setEditTitle(cal.title);
                    }}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "orange",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeCalendar(cal.id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {msg && (
        <p style={{ marginTop: "15px", color: "green" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
