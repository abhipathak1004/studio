"use client";

import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-primary shadow-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-foreground flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-primary-foreground" />
          Daily Dynamo
        </h1>
      </div>
    </header>
  );
}
