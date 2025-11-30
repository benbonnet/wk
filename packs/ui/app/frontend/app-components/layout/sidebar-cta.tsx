import { Button } from "@ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/card";

export interface CtaCardConfig {
  title: string;
  description: string;
  buttonText: string;
  onAction: () => void;
}

interface SidebarCtaProps {
  config: CtaCardConfig;
}

export function SidebarCta({ config }: SidebarCtaProps) {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Button
          className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
          size="sm"
          onClick={config.onAction}
        >
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
