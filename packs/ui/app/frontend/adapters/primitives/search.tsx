import { useState, useCallback } from "react";
import { Input } from "@ui-components/ui/input";
import { Button } from "@ui-components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@ui/utils";
import { useTranslate } from "@ui/provider";
import type { SearchProps } from "@ui/registry";

export function SEARCH({
  schema,
  placeholder,
  onSearch,
}: SearchProps) {
  const t = useTranslate();
  const [value, setValue] = useState("");

  const searchPlaceholder = placeholder || schema.placeholder || "Search...";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onSearch?.(newValue);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue("");
    onSearch?.("");
  }, [onSearch]);

  return (
    <div data-ui="search" className={cn("relative", schema.className)}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t(searchPlaceholder)}
        value={value}
        onChange={handleChange}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("Clear search")}</span>
        </Button>
      )}
    </div>
  );
}
