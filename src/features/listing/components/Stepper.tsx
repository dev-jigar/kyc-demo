"use client";


import React from "react";
import { Check } from "lucide-react";

type StepperProps = {
  steps: string[];
  active: number;
  onStepClick?: (index: number) => void;
};

export default function Stepper({ steps, active, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-center gap-3 mt-2">
        {steps.map((label, i) => {
          const isCompleted = i < active;
          const isActive = i === active;

          return (
            <React.Fragment key={i}>
              <div
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => onStepClick?.(i)}
              >
                <div
                  className={`stepper-dot ${
                    isCompleted
                      ? "stepper-dot-completed"
                      : isActive
                        ? "stepper-dot-active"
                        : "stepper-dot-pending"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight max-w-[72px] transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-semibold"
                      : isCompleted
                        ? "text-primary/70"
                        : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`stepper-line mt-[-20px] ${
                    i < active ? "stepper-line-completed" : "stepper-line-pending"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile stepper - progress bar */}
      <div className="md:hidden">
        <div className="flex items-center !gap-3 mb-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((active + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-primary whitespace-nowrap">
            {active + 1}/{steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
