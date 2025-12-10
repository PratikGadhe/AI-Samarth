export enum AppMode {
  HOME = 'HOME',
  SIGN_TO_SPEECH = 'SIGN_TO_SPEECH',
  VISUAL_ASSISTANCE = 'VISUAL_ASSISTANCE'
}

export interface VisionResponse {
  text: string;
  error?: string;
}

export interface AudioResponse {
  audioData: string | null; // Base64 string
  error?: string;
}
