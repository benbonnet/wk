# INPUT_AI_RICH_TEXT Adapter

## Purpose

Rich text editor with AI assistance features.

## Registry Interface

```ts
export interface RichTextInputProps extends InputBaseProps {
  // AI-assisted rich text
}
```

## External Dependencies

This adapter requires a rich text editor library. Options:
- **TipTap** (recommended) - headless, extensible
- **Slate** - framework for building editors
- **Lexical** (Meta) - extensible text editor framework

## Implementation (TipTap)

```tsx
import { useField } from "formik";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "@ui-components/label";
import { Button } from "@ui-components/button";
import { Toggle } from "@ui-components/toggle";
import { Separator } from "@ui-components/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Sparkles,
} from "lucide-react";
import type { RichTextInputProps } from "@ui/registry";

export function RichTextInputAdapter({
  name,
  label,
  helperText,
  placeholder,
  disabled,
}: RichTextInputProps) {
  const [field, meta, helpers] = useField(name);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
    ],
    content: field.value as string,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      helpers.setValue(editor.getHTML());
    },
    onBlur: () => {
      helpers.setTouched(true);
    },
  });

  const hasError = meta.touched && meta.error;

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Toolbar */}
      <div className="flex items-center gap-1 rounded-t-md border border-b-0 p-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="h-6" />
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        {/* AI Button */}
        <div className="flex-1" />
        <Button type="button" variant="ghost" size="sm">
          <Sparkles className="mr-1 h-4 w-4" />
          AI Assist
        </Button>
      </div>

      {/* Editor */}
      <div
        className={cn(
          "rounded-b-md border p-3 min-h-[200px] prose prose-sm max-w-none",
          hasError && "border-destructive"
        )}
      >
        <EditorContent editor={editor} />
      </div>

      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

## AI Assist Feature

```tsx
const [aiLoading, setAiLoading] = useState(false);

const handleAiAssist = async () => {
  const selection = editor.state.selection;
  const text = editor.state.doc.textBetween(selection.from, selection.to);

  if (!text) {
    toast("Select text to get AI suggestions", "error");
    return;
  }

  setAiLoading(true);
  try {
    const response = await fetch("/api/ai/improve", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    const { improved } = await response.json();

    editor
      .chain()
      .focus()
      .deleteSelection()
      .insertContent(improved)
      .run();
  } catch (error) {
    toast("Failed to get AI suggestion", "error");
  } finally {
    setAiLoading(false);
  }
};
```

## Schema Example

```json
{
  "type": "COMPONENT",
  "name": "content",
  "kind": "INPUT_AI_RICH_TEXT",
  "label": "Content",
  "placeholder": "Start writing your article..."
}
```

## Installation

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## Notes

- Stores HTML string
- Toolbar with common formatting options
- AI button for text improvement (requires backend)
- Extensible with TipTap extensions
