import { Trophy } from "lucide-react";

interface Props {
  score: number;
  total: number;
}

export default function ScoreIndicator({ score, total }: Props) {
  return (
    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
      <Trophy className="h-4 w-4 text-yellow-500" />
      <span className="font-medium">
        {score}/{total}
      </span>
    </div>
  );
}
