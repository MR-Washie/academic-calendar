import { db } from "@/lib/db";

// ✅ GET calendars
export async function GET(request) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM calendar ORDER BY id DESC"
    );

    return Response.json(rows);
  } catch (error) {
    console.error("GET ERROR:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST calendar
export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!title) {
      return Response.json(
        { success: false, error: "Title required" },
        { status: 400 }
      );
    }

    await db.execute(
      "INSERT INTO calendar (title) VALUES (?)",
      [title]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("POST ERROR:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}