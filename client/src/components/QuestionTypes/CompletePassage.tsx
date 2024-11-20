import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function CompletePassage({ question, onAnswer }: Props) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleWordClick = (word: string) => {
    if (showResult) return;
    
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleCheck = () => {
    const answer = selectedWords.join(" ");
    setShowResult(true);
    setTimeout(() => {
      onAnswer(answer === question.correctAnswer);
    }, 1500);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Complete the passage:</h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <Card className="p-4">
        <div className="min-h-[60px] p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg mb-4">
          {selectedWords.map((word, index) => (
            <span
              key={index}
              onClick={() => handleWordClick(word)}
              className={`inline-block m-1 px-3 py-1 rounded-full cursor-pointer
                ${
                  showResult
                    ? selectedWords.join(" ") === question.correctAnswer
                      ? "bg-green-100"
                      : "bg-red-100"
                    : "bg-primary/10 hover:bg-primary/20"
                }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {question.options
            .filter((word) => !selectedWords.includes(word))
            .map((word, index) => (
              <span
                key={index}
                onClick={() => handleWordClick(word)}
                className="inline-block px-3 py-1 bg-muted rounded-full cursor-pointer hover:bg-muted/80"
              >
                {word}
              </span>
            ))}
        </div>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full"
          disabled={selectedWords.length === 0 || showResult}
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
          <p>Correct completion:</p>
          <p>{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
