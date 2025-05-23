"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const goalSchema = z.object({
  text: z.string().min(1, "Goal text cannot be empty.").max(100, "Goal text is too long."),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalInputProps {
  onAddGoal: (text: string) => void;
  isLoading?: boolean;
}

export function GoalInput({ onAddGoal, isLoading }: GoalInputProps) {
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit: SubmitHandler<GoalFormData> = (data) => {
    onAddGoal(data.text);
    form.reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <PlusCircle className="w-6 h-6 mr-2 text-primary" />
          Add New Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="goalText" className="sr-only">Goal Text</FormLabel>
                  <FormControl>
                    <Input 
                      id="goalText" 
                      placeholder="e.g., Drink 10 glasses of water" 
                      {...field} 
                      className="text-base"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || form.formState.isSubmitting}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add Goal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
