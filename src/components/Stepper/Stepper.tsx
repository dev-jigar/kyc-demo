"use client";

import React from "react";

type StepperProps = {
  steps: string[];
  active: number;
  onStepClick?: (i: number) => void;
};

export function Stepper({ steps, active, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        {steps.map((label, i) => {
          const isCompleted = i < active;
          const isActive = i === active;

          return (
            <div key={i} className="flex-1 flex items-center">
              <div
                onClick={() => onStepClick?.(i)}
                className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                  isCompleted
                    ? "bg-green-100 border-green-400 text-green-700"
                    : isActive
                    ? "bg-white border-green-400 text-green-600"
                    : "bg-white border-gray-200 text-gray-400"
                } cursor-pointer`}
              >
                {isCompleted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <div className="text-sm font-medium">{i + 1}</div>
                )}
              </div>

              {i !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 ${
                    i < active ? "bg-green-200" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;
