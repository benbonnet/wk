# Card Component Documentation

## Overview

The Card component is a fundamental UI element that "displays a card with header, content, and footer." It provides a structured container for organizing related information with distinct sections.

## Installation

Install the Card component using the CLI:

```bash
pnpm dlx shadcn@latest add card
```

## Component Structure

The Card system comprises several sub-components that work together:

- **Card** - Main container wrapper
- **CardHeader** - Top section for titles and descriptions
- **CardTitle** - Heading within the header
- **CardDescription** - Supplementary text in the header
- **CardAction** - Interactive elements in the header
- **CardContent** - Primary content area
- **CardFooter** - Bottom section for actions or additional info

## Import Statement

```typescript
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

## Basic Usage

```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Example: Login Card

A practical example demonstrates a login form implementation:

```jsx
export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Styling & Customization

Components support Tailwind CSS classes for customization. Apply sizing, spacing, and layout adjustments through className properties on any sub-component.
