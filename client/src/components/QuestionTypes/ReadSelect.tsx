import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (correct: boolean) => void;
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
    setTimeout(() => {
      onAnswer(selected === question.correctAnswer);
    }, 1500);
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

      <Button
        className="w-full"
        disabled={!selected || showResult}
        onClick={handleCheck}
      >
        Check Answer
      </Button>
    </div>
  );
}
