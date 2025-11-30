# Textarea Component Documentation

## Description

The Textarea component "Displays a form textarea or a component that looks like a textarea."

## Installation

```bash
pnpm dlx shadcn@latest add textarea
```

## Basic Usage

```typescript
import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />
}
```

## Component Import

```typescript
import { Textarea } from "@/components/ui/textarea";
```

## Examples

### Default Variant

A standard textarea field accepting user input with placeholder text guidance.

```typescript
<Textarea placeholder="Type your message here." />
```

### Disabled State

The textarea can be rendered in a disabled state to prevent user interaction:

```typescript
<Textarea placeholder="Type your message here." disabled />
```

### With Label

Pair the textarea with a label element for better form accessibility:

```typescript
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaWithLabel() {
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  )
}
```

### With Helper Text

Include descriptive text below the textarea to guide users:

```typescript
<div className="grid w-full gap-3">
  <Label htmlFor="message-2">Your Message</Label>
  <Textarea placeholder="Type your message here." id="message-2" />
  <p className="text-muted-foreground text-sm">
    Your message will be copied to the support team.
  </p>
</div>
```

### With Action Button

Combine the textarea with a submit button for form submission:

```typescript
import { Button } from "@/components/ui/button"

<div className="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```
