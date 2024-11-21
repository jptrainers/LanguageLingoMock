import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Trophy, Loader2 } from "lucide-react";
import UnitCard from "@/components/UnitCard";
import { useToast } from "@/hooks/use-toast";

interface Unit {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  language: string;
  order: number;
  prerequisiteId: number | null;
  questionCount: number;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch("/api/units");
      if (!response.ok) throw new Error("Failed to fetch units");
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load units",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        {isLoading ? (
          <div className="w-full flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="w-full space-y-4">
            <h2 className="text-xl font-semibold">Select a Unit</h2>
            <div className="grid gap-4">
              {units.map((unit) => (
                <UnitCard
                  key={unit.id}
                  name={unit.name}
                  description={unit.description}
                  difficulty={unit.difficulty}
                  progress={0}
                  questionCount={unit.questionCount}
                  onClick={() => setSelectedUnit(unit.id)}
                  isSelected={selectedUnit === unit.id}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 w-full">
          <Button 
            size="lg" 
            className="w-full max-w-md text-lg mx-auto block"
            onClick={() => setLocation(`/lesson/${selectedUnit}`)}
            disabled={!selectedUnit}
          >
            Start Learning
          </Button>
          
          <div className="flex gap-3">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full text-lg"
              onClick={() => setLocation("/create")}
            >
              Create Question
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="w-full text-lg"
              onClick={() => setLocation("/manage-units")}
            >
              Manage Units
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
