import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Lock } from "lucide-react";

interface Props {
  name: string;
  description: string;
  difficulty: number;
  progress: number;
  questionCount?: number;
  isLocked?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function UnitCard({ 
  name, 
  description, 
  difficulty, 
  progress, 
  isLocked = false,
  isSelected = false,
  onClick 
}: Props) {
  return (
    <Card 
      className={`transition-all hover:shadow-lg ${!isLocked && 'cursor-pointer hover:scale-[1.02]'} ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            {name}
          </span>
          {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            {typeof questionCount === 'number' && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round((progress / 100) * questionCount)}/{questionCount} Questions</span>
                <span>{questionCount} Questions Total</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: difficulty }).map((_, i) => (
              <div 
                key={i} 
                className="h-2 w-8 rounded-full bg-primary/20" 
              />
            ))}
            {Array.from({ length: 5 - difficulty }).map((_, i) => (
              <div 
                key={i} 
                className="h-2 w-8 rounded-full bg-muted" 
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
