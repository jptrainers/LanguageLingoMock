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
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function IdentifyIdea({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCheck = () => {
    if (!selected) return;
    setShowResult(true);
    setTimeout(() => {
      onAnswer(selected === question.correctAnswer);
    }, 1500);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

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
        <Button
          className="w-full"
          disabled={!selected || showResult}
          onClick={handleCheck}
        >
          Check Answer
        </Button>

        <Button
          variant="outline"
          className="w-full"
          disabled={showResult}
          onClick={handleSkip}
        >
          Skip Question
        </Button>
      </div>

      {showResult && (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Explanation:</p>
          <p>{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
