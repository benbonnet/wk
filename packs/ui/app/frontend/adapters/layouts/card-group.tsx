import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/components/card";
import { useTranslate } from "@ui/lib/ui-renderer/provider";
import type { CardGroupProps } from "@ui/lib/ui-renderer/registry";

interface ExtendedCardGroupProps extends CardGroupProps {
  subtitle?: string;
}

export function CardGroup({
  label,
  subtitle,
  className,
  children,
}: ExtendedCardGroupProps) {
  const t = useTranslate();
  const hasHeader = label || subtitle;

  return (
    <Card data-ui="card-group" className={className}>
      {hasHeader && (
        <CardHeader>
          {label && <CardTitle>{t(label)}</CardTitle>}
          {subtitle && <CardDescription>{t(subtitle)}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={!hasHeader ? "pt-6" : ""}>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
