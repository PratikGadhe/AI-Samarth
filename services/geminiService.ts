import { GoogleGenAI, Modality } from "@google/genai";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Analysis for Signs (High Accuracy) or Surroundings (High Speed)
export const analyzeImage = async (
  base64Image: string,
  prompt: string,
  modelType: 'accuracy' | 'speed' = 'accuracy',
  systemInstruction: string = "You are a helpful assistant."
): Promise<string> => {
  try {
    const ai = getClient();
    
    // gemini-3-pro-preview for complex reasoning (Signs)
    // gemini-2.5-flash for speed (Visual Assistance)
    const modelName = modelType === 'accuracy' ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelName,
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
        temperature: 0.4,
      }
    });

    return response.text || "I couldn't analyze the image.";
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return "Sorry, connection issue. Please try again.";
  }
};

// Text to Speech Generation
export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
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
    // Using Flash for instant SOS generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a concise, urgent SMS text message.
      My Location: ${location}. 
      Context: ${userNotes}. 
      Requirement: Plain text, under 160 chars if possible. "SOS! [Name] needs help at [Location]. [Context]"`,
    });
    return response.text?.trim() || `SOS! I need help. Location: ${location}`;
  } catch (error) {
    return `SOS! I need help at ${location}. ${userNotes}`;
  }
}