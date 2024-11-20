import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function FillBlanks({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Fill in the blank:</h3>
      <p className="text-lg">{question.question}</p>
      
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={showResult}
        className={
          showResult
            ? isCorrect
              ? "border-green-500"
              : "border-red-500"
            : ""
        }
      />

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
              <p>Correct Answer:</p>
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
              onClick={() => onAnswer(isCorrect)}
            >
              Next Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
