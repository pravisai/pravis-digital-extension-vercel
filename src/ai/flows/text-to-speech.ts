'use server';

/**
 * @fileOverview Text-to-speech using the direct Gemini API (no Genkit).
 * - textToSpeech - Converts a string of text into playable audio.
 * - TextToSpeechInput - Input type.
 * - TextToSpeechOutput - Return type.
 */

import { z } from 'zod';
import wav from 'wav';
import { geminiClient } from '@/ai/openrouter'; // Exported GoogleGenerativeAI instance from your SDK file

const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  // Get the correct generative model for TTS
  const ttsModel = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash-tts' }); // Use the actual model name for TTS

  // The gemini SDK API spec for TTS may differ from text; this is a schematic example:
  const ttsResult = await ttsModel.generateContent([
    { text: input },
    {
      config: {
        response_modality: 'AUDIO',
        speech_config: {
          voice_config: {
            prebuilt_voice_config: { voice_name: 'Algenib' }
          }
        }
      }
    }
  ]);
  // The SDK's return structure for TTS may differ, but let's suppose you get audio content as a base64 string:
  // Adjust the following line based on actual SDK result format!
  const audioBase64 = ttsResult.response?.audio; // May be ttsResult.response?.candidates?.[0]?.audio or similar

  if (!audioBase64) {
    throw new Error('No audio was returned from the TTS service.');
  }

  // Optionally: If you need it packaged as a WAV (see your original code),
  // decode to buffer, then encode to a proper .wav
  const audioBuffer = Buffer.from(audioBase64, 'base64');
  const wavBase64 = await toWav(audioBuffer);

  return {
    media: 'data:audio/wav;base64,' + wavBase64,
  };
}

// PCM-to-WAV utility stays the same
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
