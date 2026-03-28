
import { Session } from "@google/genai";

let nextStartTime = 0;
const audioContext = new AudioContext({ sampleRate: 24000 });

export const playAudio = (base64Data: string | undefined) => {
  if (!base64Data) return;

  // 2. Convert Base64 to PCM16
  const binaryString = atob(base64Data);
  const pcm16 = new Int16Array(
    new Uint8Array(Array.from(binaryString, (c) => c.charCodeAt(0))).buffer,
  );

  // 3. Create the AudioBuffer (24kHz is Gemini's native output)
  const audioBuffer = audioContext.createBuffer(1, pcm16.length, 24000);
  const float32Data = audioBuffer.getChannelData(0);
  for (let i = 0; i < pcm16.length; i++) {
    float32Data[i] = pcm16[i] / 32768.0;
  }

  // 4. THE SCHEDULER LOGIC
  // If we've fallen behind, start from "now"
  const currentTime = audioContext.currentTime;
  if (nextStartTime < currentTime) {
    nextStartTime = currentTime + 0.1; // Add a tiny 100ms "safety buffer"
  }

  // 5. Create and Schedule the source
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  // Start exactly where the last chunk ended
  source.start(nextStartTime);

  // Update the time for the NEXT chunk
  nextStartTime += audioBuffer.duration;
};

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function listenUser(session: Session): Promise<{ stream: MediaStream; processor: ScriptProcessorNode }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext({ sampleRate: 16000 }); // Gemini likes 16kHz
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);

  source.connect(processor);
  processor.connect(audioContext.destination);

  processor.onaudioprocess = (e) => {
    const float32Data = e.inputBuffer.getChannelData(0);

    // 4. Convert Float32 (Browser) to Int16 (Gemini)
    const pcm16Data = new Int16Array(float32Data.length);
    for (let i = 0; i < float32Data.length; i++) {
      // Clamp values and scale to 16-bit range
      const s = Math.max(-1, Math.min(1, float32Data[i]));
      pcm16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    // 5. Send the chunk to the session
    session.sendRealtimeInput({
      audio: {
        // Convert the raw binary buffer to a Base64 string
        data: arrayBufferToBase64(pcm16Data.buffer),
        mimeType: "audio/pcm;rate=16000",
      },
    });
  };

  return { stream, processor };
}
