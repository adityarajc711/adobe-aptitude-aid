import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/assessment';
import { Download, Eye } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  current: number;
  answers: Record<string, number | string>;
  marked: Record<string, boolean>;
  onQuestionSelect: (index: number) => void;
  onDownloadAll: () => void;
  attempted: number;
  markedCount: number;
}

export function QuestionPalette({
  questions,
  current,
  answers,
  marked,
  onQuestionSelect,
  onDownloadAll,
  attempted,
  markedCount
}: QuestionPaletteProps) {
  const getQuestionStatus = (question: Question, index: number) => {
    const isAnswered = answers[question.id] !== undefined;
    const isMarked = marked[question.id];
    const isCurrent = current === index;

    if (isCurrent) return 'current';
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    return 'not-visited';
  };

  const getButtonClassName = (status: string) => {
    const base = "w-10 h-10 text-sm font-semibold transition-colors";
    
    switch (status) {
      case 'current':
        return `${base} bg-primary text-primary-foreground border-2 border-primary`;
      case 'answered':
        return `${base} bg-success text-success-foreground hover:bg-success/90`;
      case 'marked':
        return `${base} bg-warning text-warning-foreground hover:bg-warning/90`;
      case 'answered-marked':
        return `${base} bg-gradient-to-br from-success to-warning text-white`;
      default:
        return `${base} bg-muted text-muted-foreground hover:bg-muted/80 border border-border`;
    }
  };

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Question Palette</CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Attempted: {attempted}</span>
          <span>Marked: {markedCount}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Question Numbers Grid */}
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index);
            return (
              <Button
                key={question.id}
                variant="outline"
                size="sm"
                className={getButtonClassName(status)}
                onClick={() => onQuestionSelect(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="space-y-2 pt-2 border-t">
          <div className="text-sm font-medium">Legend:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span>Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted border rounded"></div>
              <span>Not Visited</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Review
          </Button>
          <Button variant="outline" size="sm" onClick={onDownloadAll} className="flex-1">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Shortcuts disabled for exam security.
        </div>
      </CardContent>
    </Card>
  );
}