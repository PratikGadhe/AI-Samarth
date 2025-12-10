import { GoogleGenAI, Modality } from "@google/genai";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Feature 1 & 2: Vision Analysis
export const analyzeImage = async (
  base64Image: string,
  prompt: string,
  systemInstruction: string = "You are a helpful assistant."
): Promise<string> => {
  try {
    const ai = getClient();
    // Using gemini-3-pro-preview as requested for high quality vision
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more accurate descriptions
      }
    });

    return response.text || "I couldn't analyze the image.";
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return "Sorry, I am having trouble seeing right now. Please try again.";
  }
};

// Text to Speech Generation
export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const ai = getClient();
    // Using gemini-2.5-flash-preview-tts for speech generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Public speaking style voice
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// SOS Message Generation
export const generateSOSMessage = async (location: string, userNotes: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a concise emergency SOS text message. 
      User Location: ${location}. 
      User Condition/Notes: ${userNotes}. 
      Format: "Emergency! [Name needed] needs help. Location: [Location]. Context: [Context]."`,
    });
    return response.text || "Emergency! I need help.";
  } catch (error) {
    return `Emergency! I need help at ${location}. ${userNotes}`;
  }
}
