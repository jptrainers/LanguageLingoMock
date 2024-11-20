import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function ListenAndType({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    // In a real implementation, we would play the audio file from the question
    // For now, we'll use the Web Speech API for demonstration
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(question.correctAnswer);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

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
        <h3 className="text-xl font-semibold">Listen and Type</h3>
        <p className="text-lg">Listen to the audio and type what you hear</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={playAudio}
            disabled={isPlaying}
          >
            <Play className="h-4 w-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Audio"}
          </Button>

          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type what you hear..."
            disabled={showResult}
            className={
              showResult
                ? answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
                  ? "border-green-500"
                  : "border-red-500"
                : ""
            }
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
        <p className="text-sm text-muted-foreground">
          Correct answer: {question.correctAnswer}
        </p>
      )}
    </div>
  );
}
