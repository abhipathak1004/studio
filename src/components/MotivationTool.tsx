"use client";

import { Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MotivationToolProps {
  message: string | null;
  onGetMotivation: () => Promise<void>;
  isGenerating: boolean;
  progress: number;
}

export function MotivationTool({ message, onGetMotivation, isGenerating, progress }: MotivationToolProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Brain className="w-6 h-6 mr-2 text-accent" />
          AI Motivator
        </CardTitle>
        <CardDescription>
          Feeling stuck? Get a personalized motivational boost!
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[80px]">
        {isGenerating && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {!isGenerating && message && (
          <p className="text-foreground italic">"{message}"</p>
        )}
        {!isGenerating && !message && progress > 0 && (
           <p className="text-muted-foreground">Click the button below for a motivational tip!</p>
        )}
         {!isGenerating && !message && progress === 0 && (
           <p className="text-muted-foreground">Complete some goals, then get a motivational tip!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onGetMotivation} disabled={isGenerating} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isGenerating ? (
            "Generating..."
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" /> Get Motivation
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
