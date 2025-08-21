import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Camera, CameraOff } from 'lucide-react';

interface AssessmentHeaderProps {
  secondsLeft: number;
  isSubmitted: boolean;
  cameraActive: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onSubmit: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function AssessmentHeader({
  secondsLeft,
  isSubmitted,
  cameraActive,
  onStartCamera,
  onStopCamera,
  onSubmit,
  videoRef
}: AssessmentHeaderProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const isTimeRunningOut = secondsLeft < 600; // Less than 10 minutes

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
          A
        </div>
        <div>
          <h1 className="text-lg font-bold">Adobe General Assessment</h1>
          <p className="text-sm text-muted-foreground">Proctored • General Aptitude & Judgment</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Timer */}
        <Badge 
          variant="outline" 
          className={`px-3 py-2 text-sm font-mono ${isTimeRunningOut ? 'bg-destructive/10 text-destructive border-destructive' : ''}`}
        >
          <Timer className="w-4 h-4 mr-2" />
          {formatTime(secondsLeft)}
        </Badge>

        {/* Camera Preview */}
        <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-20 h-15 bg-muted rounded border object-cover"
          />
          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              variant={cameraActive ? "outline" : "default"}
              onClick={cameraActive ? onStopCamera : onStartCamera}
              disabled={isSubmitted}
              className="h-7 px-2 text-xs"
            >
              {cameraActive ? (
                <>
                  <Camera className="w-3 h-3 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <CameraOff className="w-3 h-3 mr-1" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <Button 
            variant="destructive" 
            onClick={onSubmit}
            disabled={!cameraActive}
            className="font-semibold"
          >
            Submit Test
          </Button>
        )}
      </div>
    </div>
  );
}