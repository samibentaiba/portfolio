// app/api/get-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the HTML from the external URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const html = await response.text();

    // 2. Load the HTML into cheerio to parse it
    const $ = cheerio.load(html);

    // 3. Helper function to get meta tag content
    const getMetaTag = (name: string): string | undefined => {
      return (
        $(`meta[property='${name}']`).attr('content') ||
        $(`meta[name='${name}']`).attr('content')
      );
    };

    // 4. Extract the metadata
    const metadata = {
      title: $('title').first().text(),
      ogTitle: getMetaTag('og:title'),
      description: getMetaTag('description'),
      ogDescription: getMetaTag('og:description'),
      image: getMetaTag('og:image'),
    };

    // Use OG tags if they exist, otherwise fall back to standard tags
    const finalData = {
      title: metadata.ogTitle || metadata.title,
      description: metadata.ogDescription || metadata.description,
      image: metadata.image,
    };

    // 5. Send the metadata back to your client
    return NextResponse.json(finalData);

  } catch (error) {
    // Ensure the error is a standard Error object
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: 'Failed to fetch metadata', details: errorMessage },
      { status: 500 }
    );
  }
}