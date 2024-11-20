import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function InteractiveWriting({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const suggestedWords = question.options;

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Interactive Writing</h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground w-full mb-1">
              Suggested words:
            </p>
            {suggestedWords.map((word, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => !showResult && setAnswer(prev => `${prev} ${word}`.trim())}
              >
                {word}
              </Badge>
            ))}
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your response here..."
            className="min-h-[120px]"
            disabled={showResult}
          />
        </div>
      </Card>

      <div className="space-y-2">
        {!showResult ? (
          <>
            <Button
              className="w-full"
              disabled={!answer}
              onClick={handleSubmit}
            >
              Check Answer
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSkip}
            >
              Skip Question
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Sample Answer:</p>
              <p>{question.correctAnswer}</p>
              {question.explanation && (
                <>
                  <p className="mt-2 font-medium">Explanation:</p>
                  <p>{question.explanation}</p>
                </>
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => onAnswer(true)}
            >
              Next Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
