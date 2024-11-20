import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function HighlightAnswer({ question, onAnswer }: Props) {
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleHighlight = (word: string) => {
    if (showResult) return;
    
    if (highlighted.includes(word)) {
      setHighlighted(highlighted.filter((w) => w !== word));
    } else {
      setHighlighted([...highlighted, word]);
    }
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  const isCorrect = highlighted.join(" ") === question.correctAnswer;
  const words = question.question.split(" ");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Highlight the correct words:</h3>

      <Card className="p-4">
        <p className="text-lg leading-relaxed">
          {words.map((word, index) => (
            <span
              key={index}
              onClick={() => handleHighlight(word)}
              className={`cursor-pointer mx-[2px] px-1 rounded transition-colors ${
                highlighted.includes(word)
                  ? showResult
                    ? question.correctAnswer.includes(word)
                      ? "bg-green-200"
                      : "bg-red-200"
                    : "bg-primary/20"
                  : "hover:bg-muted"
              }`}
            >
              {word}
            </span>
          ))}
        </p>
      </Card>

      <div className="space-y-2">
        {!showResult ? (
          <>
            <Button
              className="w-full"
              disabled={highlighted.length === 0}
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
