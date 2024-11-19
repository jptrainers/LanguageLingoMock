import { useState } from "react";
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
import ScoreIndicator from "../components/ScoreIndicator";

const TOTAL_QUESTIONS = 5;

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
  "interactive-listening": "Interactive Listening",
  "summarize-conversation": "Summarize Conversation"
};

export default function Lesson() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const { data: questions, isLoading, isError } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const response = await fetch("/api/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      return data;
    },
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

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(score + 1);
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

    switch (question.type) {
      case "read-select":
        return (
          <>
            <QuestionTypeLabel />
            <ReadSelect question={question} onAnswer={handleAnswer} />
          </>
        );
      case "fill-blanks":
        return (
          <>
            <QuestionTypeLabel />
            <FillBlanks question={question} onAnswer={handleAnswer} />
          </>
        );
      case "read-complete":
        return (
          <>
            <QuestionTypeLabel />
            <ReadComplete question={question} onAnswer={handleAnswer} />
          </>
        );
      case "complete-sentence":
        return (
          <>
            <QuestionTypeLabel />
            <CompleteSentence question={question} onAnswer={handleAnswer} />
          </>
        );
      case "highlight-answer":
        return (
          <>
            <QuestionTypeLabel />
            <HighlightAnswer question={question} onAnswer={handleAnswer} />
          </>
        );
      case "read-aloud":
        return (
          <>
            <QuestionTypeLabel />
            <ReadAloud question={question} onAnswer={handleAnswer} />
          </>
        );
      case "listen-type":
        return (
          <>
            <QuestionTypeLabel />
            <ListenAndType question={question} onAnswer={handleAnswer} />
          </>
        );
      case "interactive-reading":
        return (
          <>
            <QuestionTypeLabel />
            <InteractiveReading question={question} onAnswer={handleAnswer} />
          </>
        );
      case "write-photo":
        return (
          <>
            <QuestionTypeLabel />
            <WriteAboutPhoto question={question} onAnswer={handleAnswer} />
          </>
        );
      case "interactive-writing":
        return (
          <>
            <QuestionTypeLabel />
            <InteractiveWriting question={question} onAnswer={handleAnswer} />
          </>
        );
      case "listen-speak":
        return (
          <>
            <QuestionTypeLabel />
            <ListenSpeak question={question} onAnswer={handleAnswer} />
          </>
        );
      case "speak-photo":
        return (
          <>
            <QuestionTypeLabel />
            <SpeakAboutPhoto question={question} onAnswer={handleAnswer} />
          </>
        );
      case "read-speak":
        return (
          <>
            <QuestionTypeLabel />
            <ReadSpeak question={question} onAnswer={handleAnswer} />
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
          <Progress value={(currentQuestion / TOTAL_QUESTIONS) * 100} className="w-2/3" />
          <ScoreIndicator score={score} total={currentQuestion} />
        </div>

        <Card className="p-6">
          {currentQuestion < TOTAL_QUESTIONS ? (
            <QuestionComponent />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Lesson Complete!</h2>
              <p>Your score: {score}/{TOTAL_QUESTIONS}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
