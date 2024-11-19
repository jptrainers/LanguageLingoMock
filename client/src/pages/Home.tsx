import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Trophy } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Language Learning
        </h1>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Daily Goal</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} />
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Current Streak: 5 days</span>
                <span>Total Score: 1240</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          size="lg" 
          className="w-full max-w-md text-lg"
          onClick={() => setLocation("/lesson")}
        >
          Start Learning
        </Button>
      </div>
    </div>
  );
}
