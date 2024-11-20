import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function IdentifyIdea({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCheck = () => {
    if (!selected) return;
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Identify the Main Idea</h3>
        <Card className="p-4">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {question.question}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <RadioGroup
          value={selected || ""}
          onValueChange={setSelected}
          className="space-y-3"
          disabled={showResult}
        >
          {question.options.map((option) => (
            <div
              key={option}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                showResult && option === question.correctAnswer
                  ? "bg-green-100"
                  : showResult && selected === option
                  ? "bg-red-100"
                  : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

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
