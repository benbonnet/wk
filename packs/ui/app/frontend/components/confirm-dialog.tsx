import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/components/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { cn } from "@ui/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  icon?: string;
  variant?: "default" | "destructive";
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  variant = "destructive",
  cancelLabel,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(isDestructive && "bg-red-600 hover:bg-red-700")}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
