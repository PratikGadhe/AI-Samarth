import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

export interface CameraViewHandle {
  capture: () => string | null;
}

const CameraView = forwardRef<CameraViewHandle, {}>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (!videoRef.current) return null;
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      ctx.drawImage(videoRef.current, 0, 0);
      // Returns base64 string without the prefix for Gemini API
      return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    }
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Prefer back camera for assistance
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access denied or unavailable.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-red-500">
        <p className="text-red-400 text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg mb-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
        Live Feed
      </div>
    </div>
  );
});

export default CameraView;