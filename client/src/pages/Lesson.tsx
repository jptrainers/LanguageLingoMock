import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReadSelect from "../components/QuestionTypes/ReadSelect";
import FillBlanks from "../components/QuestionTypes/FillBlanks";
import ReadComplete from "../components/QuestionTypes/ReadComplete";
import CompleteSentence from "../components/QuestionTypes/CompleteSentence";
import HighlightAnswer from "../components/QuestionTypes/HighlightAnswer";
import ScoreIndicator from "../components/ScoreIndicator";

const TOTAL_QUESTIONS = 5;

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

    switch (question.type) {
      case "read-select":
        return <ReadSelect question={question} onAnswer={handleAnswer} />;
      case "fill-blanks":
        return <FillBlanks question={question} onAnswer={handleAnswer} />;
      case "read-complete":
        return <ReadComplete question={question} onAnswer={handleAnswer} />;
      case "complete-sentence":
        return <CompleteSentence question={question} onAnswer={handleAnswer} />;
      case "highlight-answer":
        return <HighlightAnswer question={question} onAnswer={handleAnswer} />;
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
