import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (correct: boolean) => void;
}

export default function CompleteSentence({ question, onAnswer }: Props) {
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
        <h3 className="text-xl font-semibold">Build the sentence:</h3>
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

      <Button
        className="w-full"
        disabled={selectedWords.length === 0 || showResult}
        onClick={handleCheck}
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
