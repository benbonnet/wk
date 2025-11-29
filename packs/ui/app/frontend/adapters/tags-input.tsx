import { useState, useRef, KeyboardEvent } from "react";
import { Input } from "@ui/components/input";
import { Badge } from "@ui/components/badge";
import { Label } from "@ui/components/label";
import { X } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import { useField } from "./custom/form";
import type { InputProps } from "@ui/lib/ui-renderer/registry";

export function TagsInput({
  name,
  label,
  placeholder,
  disabled,
  helperText,
}: InputProps) {
  const t = useTranslate();
  const field = useField(name);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = (field.value as string[]) || [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      field.onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    field.onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{t(label)}</Label>}
      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-md border p-2 focus-within:ring-2 focus-within:ring-ring",
          field.error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={
            tags.length === 0
              ? placeholder
                ? t(placeholder)
                : t("Add tags...")
              : ""
          }
          disabled={disabled}
          className="flex-1 min-w-[120px] border-0 p-0 h-7 focus-visible:ring-0"
        />
      </div>
      {helperText && !field.error && (
        <p className="text-sm text-muted-foreground">{t(helperText)}</p>
      )}
      {field.error && <p className="text-sm text-destructive">{field.error}</p>}
    </div>
  );
}
