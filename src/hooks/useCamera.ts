import { useState, useRef, useCallback } from 'react';
import { Snapshot } from '@/types/assessment';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      
      setStream(mediaStream);
      setIsActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Start automatic snapshots every 30 seconds
      intervalRef.current = setInterval(() => {
        captureSnapshot();
      }, 30000);
      
      // Take initial snapshot
      setTimeout(captureSnapshot, 1000);
      
      return true;
    } catch (error) {
      console.error('Camera access failed:', error);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsActive(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const captureSnapshot = useCallback(() => {
    if (!videoRef.current || !stream) return;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        
        const snapshot: Snapshot = {
          ts: new Date().toISOString(),
          q: 1, // Will be updated by parent component
          data: dataUrl
        };
        
        setSnapshots(prev => {
          const updated = [...prev, snapshot];
          // Save to localStorage
          try {
            localStorage.setItem('AGA_snapshots', JSON.stringify(updated));
          } catch (error) {
            console.warn('Failed to save snapshot to localStorage:', error);
          }
          return updated;
        });
      }
    } catch (error) {
      console.warn('Failed to capture snapshot:', error);
    }
  }, [stream]);

  // Load snapshots from localStorage on hook initialization
  useState(() => {
    try {
      const saved = localStorage.getItem('AGA_snapshots');
      if (saved) {
        setSnapshots(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load snapshots from localStorage:', error);
    }
  });

  return {
    stream,
    isActive,
    snapshots,
    videoRef,
    startCamera,
    stopCamera,
    captureSnapshot,
    setSnapshots
  };
};