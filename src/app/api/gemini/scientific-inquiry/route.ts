import { NextResponse } from 'next/server';
import { getGemini, GEMINI_MODEL, NASA_SYSTEM_INSTRUCTION } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FIELD = 4000;

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

    const str = (v: unknown) => (typeof v === 'string' ? v.slice(0, MAX_FIELD) : '');
    const topic = str(body.topic);
    const context = str(body.context);
    const customPrompt = str(body.customPrompt);

    const promptText = `
Inquiry Topic: ${topic || 'Microgravity Flame Combustion & Fire Safety'}
Experimental Context: ${context || 'NASA CIR / SoFIE / RTDFS datasets'}
Specific Question / Hypothesis:
${customPrompt || 'Analyze how microgravity alters the flame zone, extinction boundary, and energy transfer, and provide human spaceflight safety protocols.'}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: { systemInstruction: NASA_SYSTEM_INSTRUCTION },
    });

    return NextResponse.json({
      text: response.text ?? 'No response generated.',
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error querying Gemini API:', err);
    return NextResponse.json(
      {
        error: 'Failed to generate scientific combustion insight.',
        details: err instanceof Error ? err.message : 'Unknown server error',
      },
      { status: 500 },
    );
  }
}
