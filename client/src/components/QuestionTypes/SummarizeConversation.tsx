import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function SummarizeConversation({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const suggestedWords = question.options; // Using options as key vocabulary words

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount(prev => prev + 1);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
    setShowResult(true);
    // In a real implementation, we would use NLP to evaluate the summary
    const usedKeyWords = suggestedWords.filter(word => 
      answer.toLowerCase().includes(word.toLowerCase())
    ).length;
    
    setTimeout(() => {
      onAnswer(usedKeyWords >= 2 && answer.length >= 50);
    }, 1500);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Summarize the Conversation</h3>
        <p className="text-lg">Listen to the conversation and write a summary</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={playAudio}
            disabled={isPlaying}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Conversation"}
          </Button>

          {playCount > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground w-full mb-1">
                  Key points to include:
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
                placeholder="Write your summary here..."
                className="min-h-[120px]"
                disabled={showResult}
              />
            </>
          )}
        </div>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full"
          disabled={answer.length < 50 || showResult || playCount === 0}
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
          <p>Sample summary:</p>
          <p>{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
