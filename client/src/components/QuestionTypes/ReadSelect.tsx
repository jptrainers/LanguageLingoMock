import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export default function ReadSelect({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (!selected) return;
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question.question}</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => (
          <Card
            key={option}
            className={`p-4 cursor-pointer transition-all ${
              selected === option
                ? "ring-2 ring-primary"
                : "hover:bg-muted/50"
            } ${
              showResult && option === question.correctAnswer
                ? "bg-green-100"
                : showResult && selected === option && option !== question.correctAnswer
                ? "bg-red-100"
                : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        {!showResult ? (
          <>
            <Button
              className="w-full"
              disabled={!selected}
              onClick={handleCheck}
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
              onClick={() => onAnswer(selected === question.correctAnswer)}
            >
              Next Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
