import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
  };
  onAnswer: (correct: boolean) => void;
}

export default function FillBlanks({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    setShowResult(true);
    setTimeout(() => {
      onAnswer(answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim());
    }, 1500);
  };

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
            ? answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
              ? "border-green-500"
              : "border-red-500"
            : ""
        }
      />

      <Button
        className="w-full"
        disabled={!answer || showResult}
        onClick={handleSubmit}
      >
        Check Answer
      </Button>

      {showResult && (
        <p className="text-sm text-muted-foreground">
          Correct answer: {question.correctAnswer}
        </p>
      )}
    </div>
  );
}
