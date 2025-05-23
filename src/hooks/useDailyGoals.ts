"use client";

import type { Goal } from '@/types';
import { generateMotivationalMessage, type MotivationalMessageInput } from '@/ai/flows/motivational-message';
import { useToast } from "@/hooks/use-toast";
import { differenceInCalendarDays, format, isToday, parseISO, startOfDay } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


const LOCAL_STORAGE_KEYS = {
  GOALS: 'dailyDynamo_goals',
  STREAK: 'dailyDynamo_streak',
  LAST_COMPLETED_DATE: 'dailyDynamo_lastCompletedDate',
  LAST_OPENED_DATE: 'dailyDynamo_lastOpenedDate',
};

export function useDailyGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [lastAllGoalsCompletedDate, setLastAllGoalsCompletedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  const [isGeneratingMotivation, setIsGeneratingMotivation] = useState(false);
  const { toast } = useToast();

  // Load state from localStorage
  useEffect(() => {
    try {
      const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS);
      const storedStreak = localStorage.getItem(LOCAL_STORAGE_KEYS.STREAK);
      const storedLastCompletedDate = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_COMPLETED_DATE);
      const storedLastOpenedDate = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_OPENED_DATE);
      
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      if (storedGoals) {
        let parsedGoals: Goal[] = JSON.parse(storedGoals);
        // Daily reset of goal completion status
        if (storedLastOpenedDate !== todayStr) {
          parsedGoals = parsedGoals.map(goal => ({ ...goal, completed: false }));
        }
        setGoals(parsedGoals);
      }

      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      }

      if (storedLastCompletedDate) {
        setLastAllGoalsCompletedDate(storedLastCompletedDate);
      }

      // Streak check: if last completion was before yesterday, reset streak
      if (storedLastCompletedDate && differenceInCalendarDays(new Date(), parseISO(storedLastCompletedDate)) > 1) {
        setStreak(0);
        localStorage.setItem(LOCAL_STORAGE_KEYS.STREAK, '0');
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_OPENED_DATE, todayStr);

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast({ title: "Error", description: "Could not load saved data.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  // Save state to localStorage
  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(goals));
      localStorage.setItem(LOCAL_STORAGE_KEYS.STREAK, streak.toString());
      if (lastAllGoalsCompletedDate) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_COMPLETED_DATE, lastAllGoalsCompletedDate);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_COMPLETED_DATE);
      }
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      toast({ title: "Error", description: "Could not save data.", variant: "destructive" });
    }
  }, [goals, streak, lastAllGoalsCompletedDate, isLoading, toast]);

  const addGoal = useCallback((text: string) => {
    if (!text.trim()) {
      toast({ title: "Oops!", description: "Goal text cannot be empty.", variant: "destructive" });
      return;
    }
    const newGoal: Goal = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setGoals(prevGoals => [...prevGoals, newGoal].sort((a,b) => a.createdAt - b.createdAt));
    toast({ title: "Success!", description: "Goal added."});
  }, [toast]);

  const toggleGoal = useCallback((id: string) => {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      );

      // Check for streak update
      const allCompleted = updatedGoals.length > 0 && updatedGoals.every(g => g.completed);
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      if (allCompleted) {
        if (lastAllGoalsCompletedDate !== todayStr) { // Only update streak once per day
          if (lastAllGoalsCompletedDate && differenceInCalendarDays(parseISO(todayStr), parseISO(lastAllGoalsCompletedDate)) === 1) {
            setStreak(s => s + 1);
            toast({ title: "Streak Extended!", description: `You're on a ${streak + 1} day streak!`, variant: "default" });
          } else {
            setStreak(1);
            toast({ title: "New Streak Started!", description: "Awesome, a 1-day streak!", variant: "default" });
          }
          setLastAllGoalsCompletedDate(todayStr);
        }
      } else {
        // If all goals were completed today and now one is un-checked
        if (lastAllGoalsCompletedDate === todayStr) {
          // This means the day is no longer fully complete. If streak was based on *current* day completion, it would need adjustment.
          // Current logic: streak counts past full days. If unchecking breaks today's full completion, today won't count if not re-completed.
          // To be safe, if unchecking makes goals not all complete, and lastAllGoalsCompletedDate was today, nullify it.
          // This might mean if you complete all, then uncheck, then complete all again, streak could double-increment.
          // Better: If all goals are no longer complete, but `lastAllGoalsCompletedDate` *was* today, it means the user "undid" today's completion.
          // The streak should potentially be decremented if it was incremented today.
          // Simpler: if all are not complete, and lastAllGoalsCompletedDate was today, set it to null.
          // The streak itself is only advanced when all goals become complete.
           // If today was the day of completion, and now it's not fully complete, reset lastAllGoalsCompletedDate
           // This implies the streak for today is "lost" unless re-completed.
           // The `streak` number itself is safe as it's only incremented when all goals become complete.
        }
      }
      return updatedGoals;
    });
  }, [lastAllGoalsCompletedDate, streak, toast]);


  const deleteGoal = useCallback((id: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    toast({ title: "Goal Removed", description: "The goal has been deleted.", variant: "default" });
  }, [toast]);

  const progress = goals.length > 0 ? (goals.filter(g => g.completed).length / goals.length) * 100 : 0;

  const fetchMotivationalMessage = useCallback(async () => {
    if (goals.length === 0) {
      setMotivationalMessage("Add some goals to get a motivational message!");
      return;
    }
    setIsGeneratingMotivation(true);
    setMotivationalMessage(null);
    try {
      const input: MotivationalMessageInput = {
        goals: goals.map(g => g.text),
        progress: Math.round(progress),
      };
      const result = await generateMotivationalMessage(input);
      setMotivationalMessage(result.message);
    } catch (error) {
      console.error("Failed to generate motivational message:", error);
      setMotivationalMessage("Could not fetch a motivational message right now. Keep going!");
      toast({ title: "AI Error", description: "Failed to get motivational message.", variant: "destructive" });
    } finally {
      setIsGeneratingMotivation(false);
    }
  }, [goals, progress, toast]);

  return {
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
    setGoals // Exposing setGoals for potential reordering feature later.
  };
}
