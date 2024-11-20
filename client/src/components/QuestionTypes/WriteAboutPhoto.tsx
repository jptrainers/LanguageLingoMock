import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function WriteAboutPhoto({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSubmit = () => {
    setShowResult(true);
    setTimeout(() => {
      onAnswer(answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim());
    }, 1500);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Write About the Photo</h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            <img
              src={question.options[0]}
              alt="Write about this"
              className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your description here..."
            className="min-h-[120px]"
            disabled={showResult}
          />
        </div>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full"
          disabled={!answer || showResult}
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
          <p>Correct answer:</p>
          <p>{question.correctAnswer}</p>
          {question.explanation && (
            <>
              <p className="mt-2 font-medium">Explanation:</p>
              <p>{question.explanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
