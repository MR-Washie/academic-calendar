import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all calendars
export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM calendar ORDER BY id DESC"
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/calendar error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch calendars",
      },
      { status: 500 }
    );
  }
}

// POST add calendar
export async function POST(req) {
  try {
    const body = await req.json();
    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title required" },
        { status: 400 }
      );
    }

    await db.execute(
      "INSERT INTO calendar (title) VALUES (?)",
      [title]
    );

    return NextResponse.json(
      { success: true, message: "Calendar added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/calendar error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add calendar",
      },
      { status: 500 }
    );
  }
}

// DELETE remove calendar
export async function DELETE(req) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 }
      );
    }

    await db.execute("DELETE FROM calendar WHERE id = ?", [id]);

    return NextResponse.json(
      { success: true, message: "Calendar removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/calendar error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to remove calendar",
      },
      { status: 500 }
    );
  }
}
