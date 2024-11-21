import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReadSelect from "../components/QuestionTypes/ReadSelect";
import FillBlanks from "../components/QuestionTypes/FillBlanks";
import ReadComplete from "../components/QuestionTypes/ReadComplete";
import CompleteSentence from "../components/QuestionTypes/CompleteSentence";
import HighlightAnswer from "../components/QuestionTypes/HighlightAnswer";
import ReadAloud from "../components/QuestionTypes/ReadAloud";
import ListenAndType from "../components/QuestionTypes/ListenAndType";
import InteractiveReading from "../components/QuestionTypes/InteractiveReading";
import WriteAboutPhoto from "../components/QuestionTypes/WriteAboutPhoto";
import InteractiveWriting from "../components/QuestionTypes/InteractiveWriting";
import ListenSpeak from "../components/QuestionTypes/ListenSpeak";
import SpeakAboutPhoto from "../components/QuestionTypes/SpeakAboutPhoto";
import ReadSpeak from "../components/QuestionTypes/ReadSpeak";
import IdentifyIdea from "../components/QuestionTypes/IdentifyIdea";
import TitlePassage from "../components/QuestionTypes/TitlePassage";
import CompletePassage from "../components/QuestionTypes/CompletePassage";
import InteractiveListening from "../components/QuestionTypes/InteractiveListening";
import ListenRespond from "../components/QuestionTypes/ListenRespond";
import SummarizeConversation from "../components/QuestionTypes/SummarizeConversation";
import ScoreIndicator from "../components/ScoreIndicator";

const TOTAL_QUESTIONS = 19;

const questionTypeLabels: Record<string, string> = {
  "read-select": "Read and Select",
  "fill-blanks": "Fill in the Blanks",
  "read-complete": "Read and Complete",
  "complete-sentence": "Complete the Sentence",
  "highlight-answer": "Highlight the Answer",
  "read-aloud": "Read Aloud",
  "listen-type": "Listen and Type",
  "interactive-reading": "Interactive Reading",
  "write-photo": "Write About Photo",
  "interactive-writing": "Interactive Writing",
  "listen-speak": "Listen and Speak",
  "speak-photo": "Speak About Photo",
  "read-speak": "Read and Speak",
  "identify-idea": "Identify the Main Idea",
  "title-passage": "Title the Passage",
  "complete-passage": "Complete the Passage",
  "interactive-listening": "Interactive Listening",
  "listen-respond": "Listen and Respond",
  "summarize-conversation": "Summarize the Conversation"
};

export default function Lesson() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);

  const params = useParams<{ unitId: string }>();
  const unitId = params.unitId;

  const { data: questions, isLoading, isError, error } = useQuery({
    queryKey: ["questions", unitId],
    queryFn: async () => {
      if (!unitId) {
        throw new Error("No unit selected");
      }

      const response = await fetch(`/api/units/${unitId}/questions`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch questions");
      }

      const data = await response.json();
      if (!data.length) {
        throw new Error("No questions available for this unit");
      }

      return data.map((item: { question: Question }) => item.question);
    },
    enabled: !!unitId,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load questions",
        variant: "destructive",
      });
    }
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8">
          <div className="h-40 flex items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p>Loading questions...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Handle error state
  if (isError || !questions) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8">
          <div className="h-40 flex items-center justify-center text-red-500">
            Failed to load questions. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  const handleAnswer = (correct: boolean, skipped: boolean = false) => {
    if (skipped) {
      setSkippedQuestions([...skippedQuestions, currentQuestion]);
    } else if (correct) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const QuestionComponent = () => {
    // Check if we have valid questions and current question index
    if (!Array.isArray(questions) || !questions.length || currentQuestion >= questions.length) {
      return null;
    }
    
    const question = questions[currentQuestion];
    // Ensure question object has required properties
    if (!question || !question.type || !question.question || !question.correctAnswer || !question.options) {
      return (
        <div className="text-center text-red-500">
          Invalid question format. Please try again.
        </div>
      );
    }

    // Display current question type
    const QuestionTypeLabel = () => (
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 rounded-full">
          Question Type: {questionTypeLabels[question.type] || question.type}
        </span>
      </div>
    );

    const props = {
      question,
      onAnswer: handleAnswer,
    };

    switch (question.type) {
      case "read-select":
        return (
          <>
            <QuestionTypeLabel />
            <ReadSelect {...props} />
          </>
        );
      case "fill-blanks":
        return (
          <>
            <QuestionTypeLabel />
            <FillBlanks {...props} />
          </>
        );
      case "read-complete":
        return (
          <>
            <QuestionTypeLabel />
            <ReadComplete {...props} />
          </>
        );
      case "complete-sentence":
        return (
          <>
            <QuestionTypeLabel />
            <CompleteSentence {...props} />
          </>
        );
      case "highlight-answer":
        return (
          <>
            <QuestionTypeLabel />
            <HighlightAnswer {...props} />
          </>
        );
      case "read-aloud":
        return (
          <>
            <QuestionTypeLabel />
            <ReadAloud {...props} />
          </>
        );
      case "listen-type":
        return (
          <>
            <QuestionTypeLabel />
            <ListenAndType {...props} />
          </>
        );
      case "interactive-reading":
        return (
          <>
            <QuestionTypeLabel />
            <InteractiveReading {...props} />
          </>
        );
      case "write-photo":
        return (
          <>
            <QuestionTypeLabel />
            <WriteAboutPhoto {...props} />
          </>
        );
      case "interactive-writing":
        return (
          <>
            <QuestionTypeLabel />
            <InteractiveWriting {...props} />
          </>
        );
      case "listen-speak":
        return (
          <>
            <QuestionTypeLabel />
            <ListenSpeak {...props} />
          </>
        );
      case "speak-photo":
        return (
          <>
            <QuestionTypeLabel />
            <SpeakAboutPhoto {...props} />
          </>
        );
      case "read-speak":
        return (
          <>
            <QuestionTypeLabel />
            <ReadSpeak {...props} />
          </>
        );
      case "identify-idea":
        return (
          <>
            <QuestionTypeLabel />
            <IdentifyIdea {...props} />
          </>
        );
      case "title-passage":
        return (
          <>
            <QuestionTypeLabel />
            <TitlePassage {...props} />
          </>
        );
      case "complete-passage":
        return (
          <>
            <QuestionTypeLabel />
            <CompletePassage {...props} />
          </>
        );
      case "interactive-listening":
        return (
          <>
            <QuestionTypeLabel />
            <InteractiveListening {...props} />
          </>
        );
      case "listen-respond":
        return (
          <>
            <QuestionTypeLabel />
            <ListenRespond {...props} />
          </>
        );
      case "summarize-conversation":
        return (
          <>
            <QuestionTypeLabel />
            <SummarizeConversation {...props} />
          </>
        );
      default:
        return (
          <div className="text-center text-red-500">
            Unknown question type: {question.type}
          </div>
        );
    }
  };

  // Make sure we have valid questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8">
          <div className="h-40 flex items-center justify-center text-red-500">
            No questions available. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-2/3">
            <Progress value={(currentQuestion / TOTAL_QUESTIONS) * 100} className="mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Completed: {currentQuestion}/{TOTAL_QUESTIONS}</span>
              <span>Skipped: {skippedQuestions.length}</span>
            </div>
          </div>
          <ScoreIndicator score={score} total={currentQuestion} />
        </div>

        <Card className="p-6">
          {currentQuestion < TOTAL_QUESTIONS ? (
            <QuestionComponent />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Lesson Complete!</h2>
              <p>Your score: {score}/{TOTAL_QUESTIONS}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Questions skipped: {skippedQuestions.length}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
