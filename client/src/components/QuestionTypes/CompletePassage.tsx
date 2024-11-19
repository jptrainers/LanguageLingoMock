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
  onAnswer: (correct: boolean) => void;
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Complete the Passage</h3>
        <Card className="p-4">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {question.question}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="min-h-[60px] p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            {selectedWords.map((word, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`m-1 cursor-pointer ${
                  showResult
                    ? selectedWords.join(" ") === question.correctAnswer
                      ? "bg-green-100"
                      : "bg-red-100"
                    : "hover:bg-primary/20"
                }`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {question.options
              .filter((word) => !selectedWords.includes(word))
              .map((word, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleWordClick(word)}
                >
                  {word}
                </Badge>
              ))}
          </div>
        </div>
      </Card>

      <Button
        className="w-full"
        disabled={selectedWords.length === 0 || showResult}
        onClick={handleCheck}
      >
        Check Answer
      </Button>

      {showResult && (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Correct completion:</p>
          <p>{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
