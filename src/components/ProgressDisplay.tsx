"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressDisplayProps {
  progress: number;
  completedGoals: number;
  totalGoals: number;
}

export function ProgressDisplay({ progress, completedGoals, totalGoals }: ProgressDisplayProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary" />
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalGoals > 0 ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {completedGoals} of {totalGoals} goals completed
              </span>
              <span className="text-lg font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} aria-label={`${Math.round(progress)}% of goals completed`} className="h-3"/>
          </>
        ) : (
          <p className="text-muted-foreground text-center py-2">Add goals to see your progress.</p>
        )}
      </CardContent>
    </Card>
  );
}
