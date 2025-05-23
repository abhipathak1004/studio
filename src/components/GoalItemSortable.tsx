"use client";

import type { Goal } from "@/types";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GoalItemSortableProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItemSortable({ goal, onToggle, onDelete }: GoalItemSortableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: goal.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined, // Ensure dragging item is on top
  };
  
  const handleToggle = () => {
    onToggle(goal.id);
    const checkboxElement = document.getElementById(`checkbox-${goal.id}`);
    if (checkboxElement && !goal.completed) { // Animate only on checking
      checkboxElement.classList.add('animate-check');
      setTimeout(() => checkboxElement.classList.remove('animate-check'), 300);
    }
  };
  
  return (
    <li 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out",
        isDragging && "opacity-75 shadow-xl"
      )}
    >
      <div className="flex items-center space-x-3 flex-grow">
        <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab p-1 mr-1" aria-label="Drag to reorder goal">
           <GripVertical className="w-5 h-5 text-muted-foreground" />
        </Button>
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
        className="text-destructive hover:bg-destructive/10 ml-2"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </li>
  );
}
