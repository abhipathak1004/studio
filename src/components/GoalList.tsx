"use client";

import type { Goal } from "@/types";
import { GoalItem } from "@/components/GoalItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListChecks } from "lucide-react";

interface GoalListProps {
  goals: Goal[];
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalList({ goals, onToggleGoal, onDeleteGoal }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <ListChecks className="w-6 h-6 mr-2 text-primary" />
            Today's Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No goals yet. Add some to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <ListChecks className="w-6 h-6 mr-2 text-primary" />
          Today's Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3"> {/* Added pr-3 to prevent scrollbar overlap */}
          <ul className="space-y-3">
            {goals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggle={onToggleGoal}
                onDelete={onDeleteGoal}
              />
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
