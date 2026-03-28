
import { GoogleGenAI, Modality, Session, LiveCallbacks } from "@google/genai";
import { listenUser } from "@/lib/audioUtils";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
  httpOptions: { apiVersion: "v1alpha" },
});

export async function startLiveSession(name: string, callback: LiveCallbacks): Promise<Array<Session | MediaStream | ScriptProcessorNode> | string> {
  try {
    const session: Session = await genAI.live.connect({
      model: "gemini-2.5-flash-native-audio-latest",
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: `Please greet me as ${name} in audio immediately and do not wait the user to start the conversation! You are a helpful language learning assistant who is expecting an english word to help pronanuce.
        Help the user if he or she does not pronaunce the word correctly, repeat the word again and listen to answer. You can also give a hint to the user if he or she is struggling. 
        You can also ask the user to spell the word if he or she is struggling. You have a british accent.
        Keep responses brief for a voice chat.`,
      },
      callbacks: callback,
    });

    const { stream, processor } = await listenUser(session);

    return [session, stream, processor];
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error occured while generating content.";
  }
}

//////////////////////
// any other functions
//////////////////

export async function gracefulShutdown(
  session: Session | undefined,
  stream: MediaStream,
  processor: ScriptProcessorNode,
) {
  console.log("Shutting down gracefully...");

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (processor) {
    processor.disconnect(); // Stop processing audio data
  }

  // nextStartTime = 0;

  if (session) {
    try {
      session.close();
    } catch (e) {
      console.warn("Handled minor close error:", e);
    }
  }
}
