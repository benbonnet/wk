# Alert Component Documentation

## Overview

The Alert component "Displays a callout for user attention." It's a versatile component for highlighting important information to users with customizable variants and content options.

## Installation

To add the Alert component to your project, use the CLI:

```bash
pnpm dlx shadcn@latest add alert
```

Alternatively, you can install via npm, yarn, or bun package managers.

## Import Statement

```javascript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

## Basic Usage

```jsx
<Alert variant="default | destructive">
  <Terminal />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```

## Component Variants

The Alert component supports two main variants:

- **default**: Standard informational alert styling
- **destructive**: Error or warning alert styling with attention-grabbing colors

## Example Implementations

### Success Alert
Contains a checkmark icon with a title and descriptive text explaining that changes were saved successfully.

### Title-Only Alert
Displays an alert with just an icon and title, omitting the description section.

### Error Alert (Destructive)
Shows an error state with a warning icon, title, and detailed description including a bulleted list of action items to resolve the issue.

## Component Structure

The Alert consists of three composable sub-components:

- **Alert**: The root container
- **AlertTitle**: The heading text
- **AlertDescription**: Supporting description content

Each can be combined flexibly depending on your specific messaging needs.
