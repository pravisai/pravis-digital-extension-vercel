'use server';

/**
 * Text-to-speech module using OpenRouter LLM for agentic repair and an actual TTS service for audio.
 */

import { z } from 'zod';
import wav from 'wav';
import { Writable } from 'stream';
import { generateText } from '@/ai/openrouter'; // Your new OpenRouter LLM util

const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  // 1. Use LLM to repair the prompt, make it well-formed if needed
  const text = await generateText(input);
  // 2. Use a real TTS API here; below is a placeholder:
  // For example: call Google Cloud TTS API, Azure, Elevenlabs, etc.
  // For demo, synthesize a "mock" PCM Buffer (replace with true speech audio!)
  const fakePcm = Buffer.from(text, 'utf-8'); // REPLACE with audio PCM from external TTS service!
  const wavBase64 = await toWav(fakePcm);

  return {
    media: 'data:audio/wav;base64,' + wavBase64,
  };
}

// Robust Node.js PCM-to-WAV utility
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    // Collect WAV data in a writable
    const writable = new Writable({
      write(chunk, _enc, cb) {
        bufs.push(chunk);
        cb();
      }
    });
    writable.on('error', reject);
    writable.on('finish', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });
    writer.pipe(writable);
    writer.write(pcmData);
    writer.end();
  });
}
