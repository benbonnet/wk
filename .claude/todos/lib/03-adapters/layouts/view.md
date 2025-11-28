# VIEW Adapter

## Purpose

Root container for all UI schema rendering. Manages drawers state and provides the top-level wrapper.

## Registry Interface

```ts
export interface ViewProps extends BaseRendererProps {
  // VIEW is root container
}
```

## shadcn Components Used

- None directly (simple div wrapper)
- Manages `Sheet` components for drawers

## Implementation

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@ui-components/ui/sheet";
import { useState, createContext, useContext } from "react";
import type { ViewProps } from "@ui/registry";
import type { UISchemaInterface } from "@ui/types";

interface DrawerContextValue {
  openDrawer: (name: string) => void;
  closeDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function ViewAdapter({ schema, children }: ViewProps) {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const drawerConfig = schema.drawers?.[activeDrawer || ""];

  return (
    <DrawerContext.Provider
      value={{
        openDrawer: setActiveDrawer,
        closeDrawer: () => setActiveDrawer(null),
      }}
    >
      <div className={schema.className}>
        {children}

        {/* Render drawers defined in schema */}
        <Sheet open={!!activeDrawer} onOpenChange={() => setActiveDrawer(null)}>
          <SheetContent>
            {drawerConfig && (
              <>
                <SheetHeader>
                  {drawerConfig.title && <SheetTitle>{drawerConfig.title}</SheetTitle>}
                  {drawerConfig.description && (
                    <SheetDescription>{drawerConfig.description}</SheetDescription>
                  )}
                </SheetHeader>
                {/* DynamicRenderer renders drawerConfig.elements */}
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within ViewAdapter");
  return ctx;
}
```

## Notes

- Provides drawer context for child components to open/close drawers
- Drawers are defined at the VIEW level in schema.drawers
- Uses `Sheet` component from shadcn for slide-out panels
