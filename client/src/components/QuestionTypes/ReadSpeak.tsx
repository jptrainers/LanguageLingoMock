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

export default function ReadSpeak({ question, onAnswer }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState<string>("");

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
      // Simulating transcription
      setTranscription(question.correctAnswer);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    setTimeout(() => {
      onAnswer(transcription.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim());
    }, 1500);
  };

  const handleSkip = () => {
    onAnswer(false, true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Read and Speak</h3>
        <p className="text-lg">Read the following text aloud:</p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {question.question}
          </p>

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
            <div className="space-y-2">
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
        <Button
          className="w-full"
          disabled={!audioBlob || showResult}
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
          <p>Sample pronunciation:</p>
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
