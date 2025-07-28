import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const reply = await generateText(prompt);
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
