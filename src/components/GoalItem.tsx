"use client";

import type { Goal } from "@/types";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, onToggle, onDelete }: GoalItemProps) {
  const handleToggle = () => {
    onToggle(goal.id);
    const checkboxElement = document.getElementById(`checkbox-${goal.id}`);
    if (checkboxElement && !goal.completed) { // Animate only on checking
      checkboxElement.classList.add('animate-check');
      setTimeout(() => checkboxElement.classList.remove('animate-check'), 300);
    }
  };
  
  return (
    <li className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={`checkbox-${goal.id}`}
          checked={goal.completed}
          onCheckedChange={handleToggle}
          aria-labelledby={`goal-text-${goal.id}`}
          className="w-6 h-6 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <label
          htmlFor={`checkbox-${goal.id}`}
          id={`goal-text-${goal.id}`}
          className={cn(
            "text-base cursor-pointer",
            goal.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}
        >
          {goal.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(goal.id)}
        aria-label={`Delete goal: ${goal.text}`}
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </li>
  );
}
