# Tabs Component Documentation

## Description

The Tabs component represents "a set of layered sections of content—known as tab panels—that are displayed one at a time." This interface pattern allows users to switch between different content views while maintaining a compact layout.

## Installation

Install the Tabs component using the CLI:

```bash
pnpm dlx shadcn@latest add tabs
```

## Import Statement

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

## Basic Usage

Here's a fundamental example showing account and password tabs:

```jsx
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Make changes to your account here.
  </TabsContent>
  <TabsContent value="password">
    Change your password here.
  </TabsContent>
</Tabs>
```

## Sub-Components

- **Tabs**: Root container managing the tab state
- **TabsList**: Container holding all tab triggers
- **TabsTrigger**: Individual clickable tab buttons
- **TabsContent**: Content panel associated with each tab

## Example Implementation

A complete example with form fields demonstrates practical usage:

```jsx
export function TabsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Documentation References

- **Official Docs**: [Radix UI Tabs Documentation](https://www.radix-ui.com/docs/primitives/components/tabs)
- **API Reference**: Available in the Radix UI component specification
