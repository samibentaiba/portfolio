import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { convertDocxToPdf } from "@/lib/convertDocxToPdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const docxBuffer = Buffer.from(arrayBuffer);

    // Create a temporary directory or use a known temp location
    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true });

    const inputFilePath = path.join(tempDir, `${file.name}`);

    // Write the DOCX buffer to a temporary file
    await fs.writeFile(inputFilePath, docxBuffer);

    // Convert DOCX to PDF using libreoffice-convert
    const pdfBuffer = await convertDocxToPdf(inputFilePath);

    // Clean up temporary files
    await fs.unlink(inputFilePath);

    // Convert Buffer to Uint8Array for NextResponse
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err: unknown) {
    console.error("PDF conversion error:", err);
    const message = err instanceof Error ? err.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}