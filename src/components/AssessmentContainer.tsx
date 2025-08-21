import { useState, useEffect, useCallback } from 'react';
import { User, SubmissionData } from '@/types/assessment';
import { useAssessment } from '@/hooks/useAssessment';
import { useCamera } from '@/hooks/useCamera';
import { AssessmentHeader } from './AssessmentHeader';
import { QuestionPalette } from './QuestionPalette';
import { QuestionDisplay } from './QuestionDisplay';
import { AssessmentComplete } from './AssessmentComplete';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface AssessmentContainerProps {
  user: User;
}

export function AssessmentContainer({ user }: AssessmentContainerProps) {
  const assessment = useAssessment(user);
  const camera = useCamera();
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Anti-cheating measures
  useEffect(() => {
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleCopy = (e: Event) => e.preventDefault();
    const handlePaste = (e: Event) => e.preventDefault();
    const handleCut = (e: Event) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && ['c', 'v', 'x', 'a', 's', 'p', 'u'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        toast.error('Keyboard shortcuts are disabled during the assessment.');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !assessment.state.submitted) {
        pauseAssessment('Test paused: you switched tabs or minimized the window. Please return and restart camera.');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!assessment.state.submitted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [assessment.state.submitted]);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerInterval || assessment.state.submitted) return;
    
    const interval = setInterval(() => {
      const currentSeconds = assessment.state.secondsLeft;
      if (currentSeconds <= 1) {
        clearInterval(interval);
        setTimerInterval(null);
        handleAutoSubmit();
        assessment.updateTimer(0);
        return;
      }
      assessment.updateTimer(currentSeconds - 1);
    }, 1000);
    
    setTimerInterval(interval);
  }, [timerInterval, assessment]);

  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  const pauseAssessment = (message: string) => {
    setIsPaused(true);
    stopTimer();
    camera.stopCamera();
    toast.error(message);
  };

  const resumeAssessment = () => {
    setIsPaused(false);
    startTimer();
    camera.startCamera();
    toast.success('Assessment resumed');
  };

  // Camera management
  const handleStartCamera = async () => {
    const success = await camera.startCamera();
    if (success) {
      startTimer();
      toast.success('Camera started, assessment is now active');
    } else {
      toast.error('Camera access is required to start the assessment. Please allow camera permissions and try again.');
    }
  };

  const handleStopCamera = () => {
    camera.stopCamera();
    pauseAssessment('Test paused: camera stopped. Please restart camera to resume.');
  };

  // Submission
  const handleSubmit = () => {
    if (!camera.isActive) {
      toast.error('Please start camera before submitting.');
      return;
    }

    const confirmed = window.confirm('Submit test? You cannot change answers after submission.');
    if (!confirmed) return;

    stopTimer();
    const data = assessment.submitAssessment();
    if (data) {
      setSubmissionData(data);
      camera.stopCamera();
      toast.success('Assessment submitted successfully!');
    }
  };

  const handleAutoSubmit = () => {
    const data = assessment.submitAssessment();
    if (data) {
      setSubmissionData(data);
      camera.stopCamera();
      toast.info('Time expired - Assessment auto-submitted');
    }
  };

  // Question navigation
  const handleAnswerSelect = (answer: number | string) => {
    const currentQuestion = assessment.questions[assessment.state.current];
    assessment.saveAnswer(currentQuestion.id, answer);
  };

  const handleToggleMark = () => {
    const currentQuestion = assessment.questions[assessment.state.current];
    assessment.toggleMark(currentQuestion.id);
  };

  // Download functionality
  const handleDownloadAll = () => {
    const data = {
      answers: assessment.state.answers,
      marked: assessment.state.marked,
      snapshots: camera.snapshots
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `adobe-assessment-progress-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Camera monitoring
  useEffect(() => {
    const checkCameraStatus = setInterval(() => {
      if (!camera.stream || !assessment.state.submitted) return;
      
      const tracks = camera.stream.getTracks();
      if (!tracks.length || tracks.every(t => t.readyState !== 'live')) {
        pauseAssessment('Camera disconnected. Test paused until camera resumes.');
      }
    }, 5000);

    return () => clearInterval(checkCameraStatus);
  }, [camera.stream, assessment.state.submitted]);

  const progress = assessment.getProgress();
  const currentQuestion = assessment.questions[assessment.state.current];

  // Show completion screen if submitted
  if (submissionData) {
    return <AssessmentComplete submissionData={submissionData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <AssessmentHeader
        secondsLeft={assessment.state.secondsLeft}
        isSubmitted={assessment.state.submitted}
        cameraActive={camera.isActive}
        onStartCamera={handleStartCamera}
        onStopCamera={handleStopCamera}
        onSubmit={handleSubmit}
        videoRef={camera.videoRef}
        user={user}
      />

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-card border-b">
        <Progress value={progress.percentage} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {isPaused && (
          <Alert className="mb-6 border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              Assessment is paused. Please restart your camera to continue.
              <button 
                onClick={resumeAssessment}
                className="ml-2 underline font-semibold"
              >
                Resume Assessment
              </button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Palette */}
          <div className="lg:col-span-1">
            <QuestionPalette
              questions={assessment.questions}
              current={assessment.state.current}
              answers={assessment.state.answers}
              marked={assessment.state.marked}
              onQuestionSelect={assessment.goToQuestion}
              onDownloadAll={handleDownloadAll}
              attempted={progress.attempted}
              markedCount={progress.marked}
            />
          </div>

          {/* Question Display */}
          <div className="lg:col-span-3">
            <QuestionDisplay
              question={currentQuestion}
              questionIndex={assessment.state.current}
              totalQuestions={assessment.questions.length}
              answer={assessment.state.answers[currentQuestion.id]}
              isMarked={assessment.state.marked[currentQuestion.id] || false}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={assessment.prevQuestion}
              onNext={assessment.nextQuestion}
              onToggleMark={handleToggleMark}
              isSubmitted={assessment.state.submitted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}