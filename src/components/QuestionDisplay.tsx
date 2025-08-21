import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/assessment';
import { ChevronLeft, ChevronRight, Flag, FlagOff } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  answer: number | string | undefined;
  isMarked: boolean;
  onAnswerSelect: (answer: number | string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleMark: () => void;
  isSubmitted: boolean;
}

export function QuestionDisplay({
  question,
  questionIndex,
  totalQuestions,
  answer,
  isMarked,
  onAnswerSelect,
  onPrevious,
  onNext,
  onToggleMark,
  isSubmitted
}: QuestionDisplayProps) {
  const handleOptionSelect = (optionIndex: number) => {
    if (!isSubmitted) {
      onAnswerSelect(optionIndex);
    }
  };

  const handleTextAnswer = (text: string) => {
    if (!isSubmitted) {
      onAnswerSelect(text);
    }
  };

  return (
    <Card className="min-h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {question.section}
            </Badge>
            <div className="font-semibold text-lg">
              Question {questionIndex + 1} / {totalQuestions}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isMarked ? "default" : "outline"}
              size="sm"
              onClick={onToggleMark}
              disabled={isSubmitted}
            >
              {isMarked ? <FlagOff className="w-4 h-4 mr-1" /> : <Flag className="w-4 h-4 mr-1" />}
              {isMarked ? 'Unmark' : 'Mark'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Question Text */}
        <div className="mb-6">
          <p className="text-lg font-medium leading-relaxed">{question.question}</p>
        </div>

        {/* Answer Area */}
        <div className="flex-1">
          {question.type === 'mcq' && question.options ? (
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = answer === index;
                return (
                  <button
                    key={index}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:bg-muted/50'
                    } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isSubmitted}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground text-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <Textarea
                value={typeof answer === 'string' ? answer : ''}
                onChange={(e) => handleTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-32 resize-none"
                disabled={isSubmitted}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionIndex === 0 || isSubmitted}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {isSubmitted ? 'Assessment Submitted' : 'Use navigation or question palette to move between questions'}
          </div>
          
          <Button
            variant="outline"
            onClick={onNext}
            disabled={questionIndex === totalQuestions - 1 || isSubmitted}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}