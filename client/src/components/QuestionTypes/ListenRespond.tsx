import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Volume2 } from "lucide-react";

interface Props {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (correct: boolean) => void;
}

export default function ListenRespond({ question, onAnswer }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount(prev => prev + 1);
    };
    window.speechSynthesis.speak(utterance);
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
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Listen and Respond</h3>
        <p className="text-lg">Listen to the question and select the best response</p>
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
          )}
        </div>
      </Card>

      <Button
        className="w-full"
        disabled={!selected || showResult || playCount === 0}
        onClick={handleCheck}
      >
        Check Answer
      </Button>

      {showResult && (
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Correct response:</p>
          <p>{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
