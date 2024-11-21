import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface Props {
  unitName: string;
  progress: number;
  questionsCompleted: number;
  totalQuestions: number;
  score: number;
}

export default function UnitProgress({
  unitName,
  progress,
  questionsCompleted,
  totalQuestions,
  score
}: Props) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{unitName}</h3>
        <div className="flex items-center gap-1 text-sm">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>{score}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{questionsCompleted}/{totalQuestions} Questions</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    </Card>
  );
}
