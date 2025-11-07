import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Build form for external server
    const externalFormData = new FormData();
    externalFormData.append("file", file);

    // Prepare server URL and key
    const serverUrl = process.env.CONVERTER_SERVER_URL || "http://localhost:3001";
    const apiKey = process.env.API_KEY;

    console.log("➡️ Sending to:", `${serverUrl}/api/convert-to-pdf`);
    console.log("🔑 Using API Key:", apiKey?.slice(0, 8) + "...");

    // Send to your Express conversion server
    const response = await fetch(`${serverUrl}/api/convert-to-pdf`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
      },
      body: externalFormData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${text}`);
    }

    // Return the PDF file
    const pdfBuffer = await response.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=converted.pdf",
      },
    });
  } catch (error: unknown) {
    console.error("Error in conversion route:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
