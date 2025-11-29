import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/components/ui/card";
import { useTranslate } from "@ui/lib/provider";
import type { CardGroupProps } from "@ui/lib/registry";

export function CARD_GROUP({ schema, label, children }: CardGroupProps) {
  const t = useTranslate();

  const cardTitle = label || schema.label;
  const cardDescription = schema.subtitle;
  const hasHeader = cardTitle || cardDescription;

  return (
    <Card data-ui="card-group" className={schema.className}>
      {hasHeader && (
        <CardHeader>
          {cardTitle && <CardTitle>{t(cardTitle)}</CardTitle>}
          {cardDescription && (
            <CardDescription>{t(cardDescription)}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={!hasHeader ? "pt-6" : ""}>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
