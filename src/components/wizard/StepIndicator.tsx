"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = onStepClick && step.id < currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center relative flex-1">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-5 left-[calc(50%+1.25rem)] w-[calc(100%-2.5rem)] h-0.5",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Step Circle */}
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                isClickable && "cursor-pointer hover:ring-2 hover:ring-primary/40"
              )}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                step.id
              )}
            </button>

            {/* Step Title */}
            <span
              className={cn(
                "mt-2 text-xs text-center hidden sm:block transition-colors",
                isCurrent && "text-primary font-medium",
                isCompleted && "text-primary/80",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

