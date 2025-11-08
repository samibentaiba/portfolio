'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageInfo {
  width: number;
  height: number;
  ratio: string;
  isOptimal: boolean;
  url: string;
  error?: string;
}

interface MetaTagInfo {
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  metadataBase?: string;
}

export default function ImageChecker() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [metaTags, setMetaTags] = useState<MetaTagInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingMeta, setTestingMeta] = useState(false);

  const checkImage = () => {
    setLoading(true);
    const img = new window.Image();
    
    img.onload = function() {
      setImageInfo({
        width: img.width,
        height: img.height,
        ratio: (img.width / img.height).toFixed(2),
        isOptimal: img.width === 1200 && img.height === 630,
        url: img.src
      });
      setLoading(false);
    };
    
    img.onerror = function() {
      setImageInfo({ 
        error: 'Failed to load image',
        width: 0,
        height: 0,
        ratio: '0',
        isOptimal: false,
        url: ''
      });
      setLoading(false);
    };
    
    img.src = '/metadata-placeholder.png?' + new Date().getTime();
  };

  const checkMetaTags = () => {
    setTestingMeta(true);
    
    // Get all meta tags from the page
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
    
    // Check if URLs are absolute
    const currentUrl = window.location.origin;
    
    setMetaTags({
      ogImage: ogImage || 'NOT FOUND',
      ogTitle: ogTitle || 'NOT FOUND',
      ogDescription: ogDescription || 'NOT FOUND',
      twitterImage: twitterImage || 'NOT FOUND',
      twitterCard: twitterCard || 'NOT FOUND',
      metadataBase: currentUrl
    });
    
    setTestingMeta(false);
  };

  const idealSpecs = {
    width: 1200,
    height: 630,
    ratio: '1.91:1',
    maxSize: '8MB (ideally < 1MB)'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Meta Tags Checker Section */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🔍 SEO Meta Tags Checker
          </h1>
          <p className="text-slate-600 mb-6">
            Check what meta tags are actually rendered on your page
          </p>

          <button
            onClick={checkMetaTags}
            disabled={testingMeta}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {testingMeta ? 'Checking...' : 'Check Meta Tags'}
          </button>

          {metaTags && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Current Page Meta Tags</h3>
                
                <div className="space-y-3">
                  {/* OG Image */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">og:image</p>
                    <p className="text-sm font-mono bg-white p-2 rounded break-all">
                      {metaTags.ogImage}
                    </p>
                    {metaTags.ogImage && metaTags.ogImage !== 'NOT FOUND' && (
                      <div className="mt-2 space-x-2">
                        {metaTags.ogImage.startsWith('http') ? (
                          <span className="text-xs text-green-600 font-semibold">✓ Absolute URL</span>
                        ) : (
                          <span className="text-xs text-red-600 font-semibold">✗ Relative URL (This is the problem!)</span>
                        )}
                        <button
                          onClick={() => copyToClipboard(metaTags.ogImage || '')}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Twitter Image */}
                  <div className="border-l-4 border-sky-500 pl-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">twitter:image</p>
                    <p className="text-sm font-mono bg-white p-2 rounded break-all">
                      {metaTags.twitterImage}
                    </p>
                    {metaTags.twitterImage && metaTags.twitterImage !== 'NOT FOUND' && (
                      <div className="mt-2">
                        {metaTags.twitterImage.startsWith('http') ? (
                          <span className="text-xs text-green-600 font-semibold">✓ Absolute URL</span>
                        ) : (
                          <span className="text-xs text-red-600 font-semibold">✗ Relative URL (This is the problem!)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* OG Title */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">og:title</p>
                    <p className="text-sm bg-white p-2 rounded">
                      {metaTags.ogTitle}
                    </p>
                  </div>

                  {/* Twitter Card */}
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">twitter:card</p>
                    <p className="text-sm bg-white p-2 rounded">
                      {metaTags.twitterCard}
                    </p>
                    {metaTags.twitterCard === 'summary_large_image' ? (
                      <span className="text-xs text-green-600 font-semibold">✓ Correct</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-semibold">⚠ Should be &quot;summary_large_image&quot;</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">🔧 Diagnosis</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  {metaTags.ogImage === 'NOT FOUND' && (
                    <p>❌ No og:image meta tag found on this page</p>
                  )}
                  {metaTags.ogImage && !metaTags.ogImage.startsWith('http') && metaTags.ogImage !== 'NOT FOUND' && (
                    <p>❌ Your og:image is using a relative URL. Discord/social media need absolute URLs!</p>
                  )}
                  {metaTags.ogImage && metaTags.ogImage.startsWith('http') && (
                    <p>✅ Your og:image URL is absolute - this is correct!</p>
                  )}
                </div>
              </div>

              {/* External Testing Tools */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-3">🧪 Test on External Tools</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Copy your URL and test it on these platforms:
                </p>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Your Site URL</p>
                      <p className="text-xs text-slate-600 font-mono">{metaTags.metadataBase}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(metaTags.metadataBase || '')}
                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  
                  <a 
                    href="https://www.opengraph.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-3 rounded hover:bg-slate-50 transition-colors"
                  >
                    <p className="font-semibold text-sm text-blue-600">OpenGraph.xyz →</p>
                    <p className="text-xs text-slate-600">Preview how your link looks on social media</p>
                  </a>
                  
                  <a 
                    href="https://cards-dev.twitter.com/validator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-3 rounded hover:bg-slate-50 transition-colors"
                  >
                    <p className="font-semibold text-sm text-sky-600">Twitter Card Validator →</p>
                    <p className="text-xs text-slate-600">Test Twitter/X card preview</p>
                  </a>
                  
                  <a 
                    href="https://developers.facebook.com/tools/debug/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-3 rounded hover:bg-slate-50 transition-colors"
                  >
                    <p className="font-semibold text-sm text-blue-600">Facebook Debugger →</p>
                    <p className="text-xs text-slate-600">Debug and refresh Facebook cache</p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Checker Section */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🖼️ Image Dimensions Checker
          </h1>
          <p className="text-slate-600 mb-6">
            Check if your metadata-placeholder.png meets social media requirements
          </p>

          <button
            onClick={checkImage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {loading ? 'Checking...' : 'Check Image'}
          </button>

          {imageInfo && (
            <div className="space-y-6">
              {imageInfo.error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-800 font-semibold">Error</p>
                  <p className="text-red-700">{imageInfo.error}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Make sure metadata-placeholder.png exists in your /public folder
                  </p>
                </div>
              ) : (
                <>
                  {/* Current Image Preview */}
                  <div className="border-2 border-slate-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">
                      Your Current Image
                    </h2>
                    <Image 
                      src={imageInfo.url} 
                      alt="OG Preview" 
                      width={600}
                      height={315}
                      className="w-full rounded shadow-lg border border-slate-300"
                    />
                  </div>

                  {/* Comparison Table */}
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                      Specifications Comparison
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-300">
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Property</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Your Image</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Recommended</th>
                            <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-3 px-4 font-medium text-slate-700">Width</td>
                            <td className="py-3 px-4 text-slate-900">{imageInfo.width}px</td>
                            <td className="py-3 px-4 text-slate-600">{idealSpecs.width}px</td>
                            <td className="py-3 px-4 text-center">
                              {imageInfo.width === idealSpecs.width ? (
                                <span className="text-green-600 font-bold">✓</span>
                              ) : (
                                <span className="text-amber-600 font-bold">⚠</span>
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-3 px-4 font-medium text-slate-700">Height</td>
                            <td className="py-3 px-4 text-slate-900">{imageInfo.height}px</td>
                            <td className="py-3 px-4 text-slate-600">{idealSpecs.height}px</td>
                            <td className="py-3 px-4 text-center">
                              {imageInfo.height === idealSpecs.height ? (
                                <span className="text-green-600 font-bold">✓</span>
                              ) : (
                                <span className="text-amber-600 font-bold">⚠</span>
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-3 px-4 font-medium text-slate-700">Aspect Ratio</td>
                            <td className="py-3 px-4 text-slate-900">{imageInfo.ratio}:1</td>
                            <td className="py-3 px-4 text-slate-600">{idealSpecs.ratio}</td>
                            <td className="py-3 px-4 text-center">
                              {Math.abs(parseFloat(imageInfo.ratio) - 1.905) < 0.02 ? (
                                <span className="text-green-600 font-bold">✓</span>
                              ) : (
                                <span className="text-amber-600 font-bold">⚠</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium text-slate-700">Max Size</td>
                            <td className="py-3 px-4 text-slate-900">Check manually</td>
                            <td className="py-3 px-4 text-slate-600">{idealSpecs.maxSize}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-slate-400">-</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Overall Status */}
                  <div className={`rounded-lg p-6 ${
                    imageInfo.isOptimal 
                      ? 'bg-green-50 border-l-4 border-green-500' 
                      : 'bg-amber-50 border-l-4 border-amber-500'
                  }`}>
                    <h3 className={`font-bold text-lg mb-2 ${
                      imageInfo.isOptimal ? 'text-green-800' : 'text-amber-800'
                    }`}>
                      {imageInfo.isOptimal ? '✓ Perfect!' : '⚠ Needs Adjustment'}
                    </h3>
                    <p className={imageInfo.isOptimal ? 'text-green-700' : 'text-amber-700'}>
                      {imageInfo.isOptimal 
                        ? 'Your image meets the recommended specifications for social media sharing.'
                        : 'Your image should be resized to 1200×630 pixels for optimal display on Discord, Facebook, Twitter, and LinkedIn.'
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Fix Guide */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Quick Fix Guide</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 rounded p-3">
              <p className="font-semibold mb-1">1. Make sure your layout.tsx has metadataBase</p>
              <code className="text-xs bg-black/30 p-2 rounded block mt-2">
                metadataBase: new URL(&quot;https://bentaidev.vercel.app&quot;)
              </code>
            </div>
            <div className="bg-white/10 rounded p-3">
              <p className="font-semibold mb-1">2. Use absolute URLs in openGraph images</p>
              <code className="text-xs bg-black/30 p-2 rounded block mt-2">
                url: `$&#123;BASE_URL&#125;/metadata-placeholder.png`
              </code>
            </div>
            <div className="bg-white/10 rounded p-3">
              <p className="font-semibold mb-1">3. After deploying, clear cache on social platforms</p>
              <p className="text-xs mt-1">Use the external testing tools above to force refresh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}