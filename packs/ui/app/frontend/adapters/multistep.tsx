import {
  useState,
  createContext,
  useContext,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { Button } from "@ui-components/button";
import { Card, CardContent, CardFooter } from "@ui-components/card";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { MultistepProps } from "@ui/registry";

interface MultistepContextValue {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const MultistepContext = createContext<MultistepContextValue | null>(
  null,
);

export function useMultistep() {
  const ctx = useContext(MultistepContext);
  if (!ctx) throw new Error("useMultistep must be used within Multistep");
  return ctx;
}

interface ElementSchema {
  type: string;
  label?: string;
  [key: string]: unknown;
}

export function Multistep({
  currentStep: controlledStep,
  onStepChange,
  className,
  elements,
  children,
}: MultistepProps & { elements?: ElementSchema[] }) {
  const t = useTranslate();
  const [internalStep, setInternalStep] = useState(0);

  const currentStep = controlledStep ?? internalStep;
  const steps = Children.toArray(children);
  const totalSteps = steps.length;

  const handleStepChange = (step: number) => {
    if (onStepChange) {
      onStepChange(step);
    } else {
      setInternalStep(step);
    }
  };

  const contextValue: MultistepContextValue = {
    currentStep,
    totalSteps,
    nextStep: () => handleStepChange(Math.min(currentStep + 1, totalSteps - 1)),
    prevStep: () => handleStepChange(Math.max(currentStep - 1, 0)),
    goToStep: (step) =>
      handleStepChange(Math.max(0, Math.min(step, totalSteps - 1))),
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };

  // Get step labels from elements prop (schema) or from children props
  const stepLabels = elements
    ? elements.map((el) => el.label)
    : steps.map((step) => {
        if (isValidElement(step)) {
          return (step.props as { label?: string }).label;
        }
        return undefined;
      });

  return (
    <MultistepContext.Provider value={contextValue}>
      <Card data-ui="multistep" className={className}>
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 border-b p-4">
          {steps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => index <= currentStep && handleStepChange(index)}
              disabled={index > currentStep}
              className={cn(
                "flex items-center gap-2",
                index <= currentStep
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  index === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index < currentStep
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </div>
              {stepLabels[index] && (
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    index === currentStep
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {t(stepLabels[index]!)}
                </span>
              )}
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8 transition-colors",
                    index < currentStep ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </button>
          ))}
        </div>

        {/* Current Step Content */}
        <CardContent className="pt-6">
          {steps.map((step, index) => {
            if (index === currentStep) {
              if (isValidElement(step)) {
                return cloneElement(
                  step as React.ReactElement<{ active?: boolean }>,
                  {
                    key: index,
                    active: true,
                  },
                );
              }
              return step;
            }
            return null;
          })}
        </CardContent>

        {/* Navigation */}
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={contextValue.prevStep}
            disabled={contextValue.isFirstStep}
          >
            {t("Previous")}
          </Button>
          <Button type="button" onClick={contextValue.nextStep}>
            {contextValue.isLastStep ? t("Submit") : t("Next")}
          </Button>
        </CardFooter>
      </Card>
    </MultistepContext.Provider>
  );
}
