"use client";

import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card className="shadow-lg text-center bg-gradient-to-br from-primary to-accent">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground flex items-center justify-center">
          <Flame className="w-7 h-7 mr-2 text-primary-foreground" />
          Current Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold text-primary-foreground">{streak}</p>
        <p className="text-sm text-primary-foreground/80 mt-1">
          {streak === 1 ? "day" : "days"} strong! Keep it up!
        </p>
      </CardContent>
    </Card>
  );
}
