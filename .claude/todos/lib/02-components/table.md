# Table Component Documentation

## Description

The Table component is "a responsive table component" designed for displaying structured data in a clean, accessible format. It works with shadcn/ui's component system and is built on standard HTML table elements.

## Installation

### Using CLI

```bash
pnpm dlx shadcn@latest add table
```

The command works with other package managers by replacing `pnpm` with `npm`, `yarn`, or `bun`.

## Import Statement

```javascript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

## Core Components

The Table component system includes the following sub-components:

- **Table** - Root container for the entire table
- **TableCaption** - Descriptive text for the table
- **TableHeader** - Container for header rows
- **TableBody** - Container for data rows
- **TableFooter** - Container for footer rows
- **TableHead** - Individual header cell
- **TableRow** - Single row container
- **TableCell** - Individual data cell

## Usage Example

```jsx
export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

## Advanced Usage

For complex data scenarios, the documentation suggests combining the Table component "with [@tanstack/react-table] to create tables with sorting, filtering and pagination." Reference the Data Table documentation for detailed implementation guidance.
