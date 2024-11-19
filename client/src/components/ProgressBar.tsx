import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface Props {
  current: number;
  total: number;
  score: number;
  showScore?: boolean;
}

export default function ProgressBar({ current, total, score, showScore = true }: Props) {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Question {current + 1} of {total}
        </span>
        {showScore && (
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{score}</span>
          </div>
        )}
      </div>
      
      <Progress
        value={progress}
        className="h-2"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{Math.round(progress)}% Complete</span>
        <span>{total - current} Questions Left</span>
      </div>
    </div>
  );
}
