import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Play, Square } from "lucide-react";

interface Props {
  question: {
    question: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
  };
  onAnswer: (correct: boolean, skipped?: boolean) => void;
}

export default function ReadAloud({ question, onAnswer }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Read Aloud</h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col items-center gap-4">
          {!audioBlob ? (
            <Button
              className="w-full"
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          ) : (
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
              </div>
              <Button
                className="w-full"
                onClick={() => setAudioBlob(null)}
                variant="outline"
              >
                Record Again
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-2">
        {!showResult ? (
          <>
            <Button
              className="w-full"
              disabled={!audioBlob}
              onClick={handleSubmit}
            >
              Check Answer
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSkip}
            >
              Skip Question
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Sample Pronunciation:</p>
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
              onClick={() => onAnswer(true)}
            >
              Next Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
