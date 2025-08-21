import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubmissionData } from '@/types/assessment';
import { Download, CheckCircle, Clock, FileText } from 'lucide-react';

interface AssessmentCompleteProps {
  submissionData: SubmissionData;
}

export function AssessmentComplete({ submissionData }: AssessmentCompleteProps) {
  const handleDownloadResponses = () => {
    const dataStr = JSON.stringify(submissionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `adobe-assessment-responses-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const percentage = Math.round((submissionData.score.score / submissionData.score.max) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>
          <CardTitle className="text-2xl font-bold text-success">Assessment Completed!</CardTitle>
          <p className="text-muted-foreground">Your responses have been successfully submitted</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Summary */}
          <div className="text-center p-6 bg-muted rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">
              {submissionData.score.score} / {submissionData.score.max}
            </div>
            <div className="text-lg font-semibold mb-1">{percentage}%</div>
            <p className="text-sm text-muted-foreground">
              MCQs auto-scored • Open responses require manual review
            </p>
          </div>

          {/* Submission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Submitted:</strong> {formatDateTime(submissionData.submittedAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Candidate:</strong> {submissionData.user.name}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Answered Questions:</span>
                <Badge variant="outline">
                  {Object.keys(submissionData.answers).length} / 100
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Marked for Review:</span>
                <Badge variant="outline">
                  {Object.values(submissionData.marked).filter(Boolean).length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Download Your Responses</h3>
                <p className="text-sm text-muted-foreground">
                  Download a complete record of your answers and proctoring snapshots
                </p>
              </div>
            </div>
            
            <Button onClick={handleDownloadResponses} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Responses & Snapshots
            </Button>
          </div>

          {/* Additional Information */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>
              This assessment was proctored with {submissionData.snapshots.length} snapshots captured.
              Results will be reviewed and you will be contacted regarding next steps.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}