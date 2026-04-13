import { db } from "@/lib/db";

// ✅ GET events (optional filter by calendar_id)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const calendar_id = searchParams.get("calendar_id");

    let query = "SELECT * FROM events";
    let values = [];

    if (calendar_id) {
      query += " WHERE calendar_id = ?";
      values.push(calendar_id);
    }

    query += " ORDER BY start_date ASC";

    const [rows] = await db.execute(query, values);

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ✅ POST event
export async function POST(req) {
  try {
    const {
      calendar_id,
      academic_activity,
      program,
      start_date,
      end_date,
      remarks,
    } = await req.json();

    if (!calendar_id || !academic_activity) {
      return Response.json(
        { success: false, error: "calendar_id and academic_activity required" },
        { status: 400 }
      );
    }

    await db.execute(
      `INSERT INTO events 
      (calendar_id, academic_activity, program, start_date, end_date, remarks)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        calendar_id,
        academic_activity,
        program,
        start_date || null,
        end_date || null,
        remarks || null,
      ]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}