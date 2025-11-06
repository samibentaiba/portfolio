import { NextRequest, NextResponse } from "next/server";
import ConvertAPI from 'convertapi';

// Authenticate with your secret from https://www.convertapi.com/a
const convertApi = new ConvertAPI(process.env.CONVERTAPI_SECRET || '');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const docxBuffer = Buffer.from(arrayBuffer);

    const result = await convertApi.convert('pdf', { File: docxBuffer }, 'docx');

    if (!result || !result.file) {
        throw new Error('Conversion failed');
    }

    const pdfArrayBuffer = await fetch(result.file.url).then(res => res.arrayBuffer());
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    return new NextResponse(pdfBuffer, {
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