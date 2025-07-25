'use server';

/**
 * @fileOverview This file defines a Genkit flow for converting text to speech.
 * - textToSpeech - A function that converts a string of text into playable audio.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/gemini';
import { z } from 'zod';
import wav from 'wav';

const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

// Main user-facing function
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return await textToSpeechFlow(input);
}

// Convert PCM data buffer to base64 WAV string
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

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', d => bufs.push(d));
    writer.on('finish', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Genkit v1 text-to-speech flow using a string model name
export const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts', // Use the model name as a string
      prompt: query,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
    });

    if (!media) {
      throw new Error('No audio media was returned from the TTS service.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
