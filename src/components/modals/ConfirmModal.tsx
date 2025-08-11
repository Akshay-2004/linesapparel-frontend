import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Trash2, CheckCircle2, LogOut } from "lucide-react";

type ModalVariant = "delete" | "warning" | "info" | "success" | "logout";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  header: string;
  description?: string;
  variant?: ModalVariant;
}

const variantStyles = {
  delete: {
    title: "text-red-600",
    description: "text-muted-foreground",
    confirmButton: "bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700",
    icon: Trash2,
    iconColor: "text-red-600",
  },
  warning: {
    title: "text-yellow-600",
    description: "text-muted-foreground",
    confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600 hover:border-yellow-700",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  info: {
    title: "text-primary",
    description: "text-muted-foreground",
    confirmButton: "bg-primary hover:bg-primary/90 text-primary-foreground border-primary hover:border-primary/90",
    icon: Info,
    iconColor: "text-primary",
  },
  success: {
    title: "text-green-600",
    description: "text-muted-foreground",
    confirmButton: "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700",
    icon: CheckCircle2,
    iconColor: "text-green-600",
  },
  logout: {
    title: "text-primary",
    description: "text-muted-foreground",
    confirmButton: "bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-red-500",
    icon: LogOut,
    iconColor: "text-primary",
  },
};

export const ConfirmModal = ({
  children,
  onConfirm,
  disabled,
  header,
  description,
  variant = "info",
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border rounded-xs">
        <AlertDialogHeader>
          <div className="mx-auto mb-4">
            <Icon className={cn("h-12 w-12", styles.iconColor)} />
          </div>
          <AlertDialogTitle
            className={cn("text-center text-2xl", styles.title)}
          >
            {header}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={cn("text-balance text-center", styles.description)}
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled}
            onClick={handleConfirm}
            className={cn(styles.confirmButton, "rounded-xs")}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
