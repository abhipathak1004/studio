"use client";

import { AppHeader } from "@/components/AppHeader";
import { GoalInput } from "@/components/GoalInput";
import { GoalList } from "@/components/GoalList";
import { MotivationTool } from "@/components/MotivationTool";
import { ProgressDisplay } from "@/components/ProgressDisplay";
import { StreakCounter } from "@/components/StreakCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyGoals } from "@/hooks/useDailyGoals";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { GoalItemSortable } from '@/components/GoalItemSortable'; // New sortable item
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function DailyDynamoPage() {
  const {
    goals,
    addGoal,
    toggleGoal,
    deleteGoal,
    streak,
    progress,
    isLoading,
    motivationalMessage,
    fetchMotivationalMessage,
    isGeneratingMotivation,
    setGoals
  } = useDailyGoals();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </main>
      </>
    );
  }
  
  const completedGoalsCount = goals.filter(g => g.completed).length;

  return (
    <>
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <GoalInput onAddGoal={addGoal} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCounter streak={streak} />
            <ProgressDisplay progress={progress} completedGoals={completedGoalsCount} totalGoals={goals.length} />
          </div>
          
          {goals.length === 0 ? (
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
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <ListChecks className="w-6 h-6 mr-2 text-primary" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <ScrollArea className="h-[300px] pr-3">
                    <SortableContext items={goals.map(g => g.id)} strategy={verticalListSortingStrategy}>
                      <ul className="space-y-3">
                        {goals.map((goal) => (
                          <GoalItemSortable
                            key={goal.id}
                            goal={goal}
                            onToggle={toggleGoal}
                            onDelete={deleteGoal}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </ScrollArea>
                </DndContext>
              </CardContent>
            </Card>
          )}

          <MotivationTool
            message={motivationalMessage}
            onGetMotivation={fetchMotivationalMessage}
            isGenerating={isGeneratingMotivation}
            progress={progress}
          />
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Daily Dynamo. Stay motivated!</p>
      </footer>
    </>
  );
}
