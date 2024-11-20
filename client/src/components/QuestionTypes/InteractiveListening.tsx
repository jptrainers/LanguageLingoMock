import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Volume2 } from "lucide-react";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function InteractiveListening({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(question.correctAnswer);
    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount(prev => prev + 1);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  const isCorrect = answer.toLowerCase().includes(question.correctAnswer.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Interactive Listening</h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={playAudio}
            disabled={isPlaying}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Audio"}
          </Button>

          {playCount > 0 && (
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write what you heard..."
              className="min-h-[120px]"
              disabled={showResult}
            />
          )}
        </div>
      </Card>

      <div className="space-y-2">
        {!showResult ? (
          <>
            <Button
              className="w-full"
              disabled={!answer || playCount === 0}
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
