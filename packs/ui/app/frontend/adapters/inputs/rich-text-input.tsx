import { Label } from "@ui-components/ui/label";
import { Button } from "@ui-components/ui/button";
import { Separator } from "@ui-components/ui/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Sparkles,
} from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { InputProps } from "@ui/registry";

/**
 * Rich text input with AI assistance.
 *
 * Note: This is a simplified implementation using a textarea.
 * For full rich text editing, install TipTap:
 * npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
 *
 * Then replace the textarea with TipTap's EditorContent component.
 */
export function INPUT_AI_RICH_TEXT({
  name,
  label,
  placeholder,
  helperText,
  rows = 6,
  disabled,
  value,
  onChange,
  error,
}: InputProps) {
  const t = useTranslate();

  // In a full implementation, these would interact with TipTap
  const handleFormat = (format: string) => {
    console.log("Format:", format);
    // Implement formatting with TipTap editor.chain().focus()...
  };

  const handleAiAssist = () => {
    console.log("AI Assist triggered");
    // Implement AI assistance - call backend API
  };

  return (
    <div className="space-y-2">
      {label && <Label>{t(label)}</Label>}

      {/* Toolbar */}
      <div className="flex items-center gap-1 rounded-t-md border border-b-0 p-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("bold")}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("italic")}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("heading")}
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("bulletList")}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("orderedList")}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* AI Button */}
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAiAssist}
          disabled={disabled}
        >
          <Sparkles className="mr-1 h-4 w-4" />
          {t("AI Assist")}
        </Button>
      </div>

      {/* Editor */}
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder ? t(placeholder) : t("Start writing...")}
        disabled={disabled}
        value={(value as string) ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "w-full rounded-b-md border border-t-0 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          error && "border-destructive"
        )}
      />

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
