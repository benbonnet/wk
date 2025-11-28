# Form Component Documentation

## Overview

The Form component serves as an abstraction layer over the `react-hook-form` library, enabling developers to construct accessible, well-structured forms with validation support.

**Status Note:** "We are not actively developing this component anymore." The documentation recommends using the `<Field />` component for new implementations.

## Installation

```bash
pnpm dlx shadcn@latest add form
```

Alternative package managers:
- npm
- yarn
- bun

## Key Features

The Form component provides:

- Composable components for form construction
- A `<FormField />` component enabling controlled form fields
- Form validation through Zod integration
- Built-in accessibility and error message handling
- Automatic unique ID generation via `React.useId()`
- Proper ARIA attribute application based on field states
- Full compatibility with Radix UI components
- Complete markup and styling control

## Component Anatomy

```jsx
<Form>
  <FormField
    control={...}
    name="..."
    render={() => (
      <FormItem>
        <FormLabel />
        <FormControl>
          { /* Your form field */ }
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

## Setup Steps

### 1. Define Schema

Create a Zod schema defining form structure:

```typescript
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
```

### 2. Initialize Form

Use the `useForm` hook from react-hook-form:

```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
}
```

### 3. Build the Form

Compose the form using provided components:

```typescript
return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
)
```

## Important Notes

- `FormField` requires controlled components, necessitating default values in form initialization
- The component integrates seamlessly with Radix UI primitives
- Schema validation occurs both client-side and supports server-side validation patterns
- Full type safety is maintained throughout the form lifecycle
