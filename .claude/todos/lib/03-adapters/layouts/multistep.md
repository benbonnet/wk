# MULTISTEP Adapter

## Purpose

Multi-step form wizard with step navigation and validation per step.

## Registry Interface

```ts
export interface MultistepProps extends BaseRendererProps {
  // Handles step navigation
}
```

## shadcn Components Used

- `Button` (for navigation)
- `Tabs`, `TabsList`, `TabsTrigger` (optional for step indicators)
- `Card` (optional wrapper)
- `Separator`

## Implementation

```tsx
import { useState, createContext, useContext } from "react";
import { Button } from "@ui-components/button";
import { Card, CardContent, CardFooter } from "@ui-components/card";
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

export const MultistepContext = createContext<MultistepContextValue | null>(null);

export function MultistepAdapter({ schema, children }: MultistepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = React.Children.toArray(children);
  const totalSteps = steps.length;

  const contextValue: MultistepContextValue = {
    currentStep,
    totalSteps,
    nextStep: () => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)),
    prevStep: () => setCurrentStep((s) => Math.max(s - 1, 0)),
    goToStep: (step) => setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1))),
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };

  return (
    <MultistepContext.Provider value={contextValue}>
      <Card className={schema.className}>
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 p-4 border-b">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <CardContent className="pt-6">
          {steps[currentStep]}
        </CardContent>

        {/* Navigation */}
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={contextValue.prevStep}
            disabled={contextValue.isFirstStep}
          >
            Previous
          </Button>
          <Button
            onClick={contextValue.nextStep}
            disabled={contextValue.isLastStep}
          >
            {contextValue.isLastStep ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </MultistepContext.Provider>
  );
}

export function useMultistep() {
  const ctx = useContext(MultistepContext);
  if (!ctx) throw new Error("useMultistep must be used within MultistepAdapter");
  return ctx;
}
```

## With Tabs-style Navigation

```tsx
import { Tabs, TabsList, TabsTrigger } from "@ui-components/tabs";

// Step indicators as tabs
<TabsList className="grid w-full grid-cols-3">
  {steps.map((step, index) => (
    <TabsTrigger
      key={index}
      value={String(index)}
      disabled={index > currentStep}
      onClick={() => goToStep(index)}
    >
      {step.props.label || `Step ${index + 1}`}
    </TabsTrigger>
  ))}
</TabsList>
```

## Schema Example

```json
{
  "type": "FORM",
  "elements": [
    {
      "type": "MULTISTEP",
      "elements": [
        {
          "type": "STEP",
          "label": "Personal Info",
          "elements": [
            { "type": "COMPONENT", "name": "first_name", "kind": "INPUT_TEXT" },
            { "type": "COMPONENT", "name": "last_name", "kind": "INPUT_TEXT" }
          ]
        },
        {
          "type": "STEP",
          "label": "Contact",
          "elements": [
            { "type": "COMPONENT", "name": "email", "kind": "INPUT_TEXT" },
            { "type": "COMPONENT", "name": "phone", "kind": "INPUT_TEXT" }
          ]
        },
        {
          "type": "STEP",
          "label": "Review",
          "elements": [
            { "type": "ALERT", "label": "Please review your information" }
          ]
        }
      ]
    }
  ]
}
```

## Notes

- Each STEP child is rendered one at a time
- Validation can be triggered on step change
- Context provides navigation methods to child components
- Final step typically shows summary or triggers form submit
