import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Clock, Shield, AlertTriangle } from 'lucide-react';

interface AssessmentInstructionsProps {
  onStart: () => void;
  onBack: () => void;
}

export function AssessmentInstructions({ onStart, onBack }: AssessmentInstructionsProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
              A
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Assessment Instructions</CardTitle>
              <p className="text-muted-foreground">Please read carefully before starting</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              This is a proctored assessment with strict monitoring. Any violation may result in automatic disqualification.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Camera Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your webcam on throughout the test. If camera is disabled, test will pause automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Anti-Cheating Measures</h3>
                  <p className="text-sm text-muted-foreground">
                    Do not minimize, switch tabs, or use shortcuts. Copy/paste and right-click are disabled.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Time Limit</h3>
                  <p className="text-sm text-muted-foreground">
                    You have 90 minutes to complete 100 questions. Timer will auto-submit when time expires.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Assessment Sections</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Quantitative Aptitude (25 questions)</li>
                  <li>• Logical Reasoning (25 questions)</li>
                  <li>• Verbal Ability (20 questions)</li>
                  <li>• Technical Basics (15 questions)</li>
                  <li>• Situational Judgment (15 questions)</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Important Notes</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Snapshots taken every 30 seconds</li>
                  <li>• Progress saved automatically</li>
                  <li>• Can mark questions for review</li>
                  <li>• Download responses after submission</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={onBack}>
              Back to Login
            </Button>
            <Button onClick={onStart} size="lg" className="font-semibold">
              I Understand - Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}