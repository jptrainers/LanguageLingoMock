import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function InteractiveWriting({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const suggestedWords = question.options; // Using options as suggested vocabulary

  const handleSubmit = () => {
    setShowResult(true);
    // In a real implementation, we would use more sophisticated text analysis
    const usedSuggestedWords = suggestedWords.filter(word => 
      answer.toLowerCase().includes(word.toLowerCase())
    ).length;
    
    setTimeout(() => {
      onAnswer(usedSuggestedWords >= 2 && answer.length >= 20);
    }, 1500);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Interactive Writing</h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground w-full mb-1">
              Suggested words:
            </p>
            {suggestedWords.map((word, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => !showResult && setAnswer(prev => `${prev} ${word}`.trim())}
              >
                {word}
              </Badge>
            ))}
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your response here..."
            className="min-h-[120px]"
            disabled={showResult}
          />
        </div>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full"
          disabled={answer.length < 20 || showResult}
          onClick={handleSubmit}
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
          <p>Sample answer:</p>
          <p>{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
