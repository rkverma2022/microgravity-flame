import { NextResponse } from 'next/server';
import { getGemini, GEMINI_MODEL, NASA_SYSTEM_INSTRUCTION } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_BASE64_CHARS = 14 * 1024 * 1024; // ~10 MB of image data

export async function POST(req: Request) {
  try {
    const ai = getGemini();
    if (!ai) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Set GEMINI_API_KEY in .env.local.' },
        { status: 503 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { imageBase64, mimeType = 'image/png', experimentNotes } = body;

    if (typeof imageBase64 !== 'string' || !imageBase64) {
      return NextResponse.json({ error: 'imageBase64 payload is required.' }, { status: 400 });
    }
    if (imageBase64.length > MAX_BASE64_CHARS) {
      return NextResponse.json({ error: 'Image is too large (max ~10 MB).' }, { status: 413 });
    }
    if (typeof mimeType !== 'string' || !ALLOWED_MIME.has(mimeType)) {
      return NextResponse.json({ error: 'Unsupported image type. Use PNG, JPEG or WebP.' }, { status: 400 });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[\w+.-]+;base64,/, '');
    const notes = typeof experimentNotes === 'string' ? experimentNotes.slice(0, 1000) : '';

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: cleanBase64 } },
            {
              text: `Analyze this NASA microgravity combustion frame.
Experiment reference: ${notes || 'NASA ISS CIR / SoFIE experiment'}.
Detail:
1. Flame Morphology (Sphericity, Soot production, Chemiluminescent blue zone vs yellow luminous zone).
2. Heat & Mass Transfer Mode (Diffusion vs Convection, Oxygen replenishment flow, radiation loss).
3. Smoldering or Extinction Risk (Quenching distance, flammability limits in microgravity).
4. Safety Protocol Recommendation for lunar or spacecraft habitat containment.
5. If wire/mesh or electrostatic elements are visible, note ionization and heating characteristics.`,
            },
          ],
        },
      ],
      config: { systemInstruction: NASA_SYSTEM_INSTRUCTION },
    });

    return NextResponse.json({
      analysis: response.text ?? 'No analysis generated.',
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error analyzing flame image:', err);
    return NextResponse.json(
      {
        error: 'Failed to analyze flame image.',
        details: err instanceof Error ? err.message : 'Unknown server error',
      },
      { status: 500 },
    );
  }
}
