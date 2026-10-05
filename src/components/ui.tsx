import * as Dialog from "@radix-ui/react-dialog";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Check, X, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "solid",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "quiet" | "outline";
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className={`modal-content ${wide ? "modal-wide" : ""}`}>
          <div className="modal-title">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="icon-button" aria-label="Cerrar ventana">
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function ChoiceGroup({
  value,
  onChange,
  options,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
    description?: string;
    icon: LucideIcon;
  }[];
  label: string;
  className?: string;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
      aria-label={label}
      className={`choice-group ${className}`}
    >
      {options.map(
        ({ value: option, label: caption, description, icon: Icon }) => (
          <ToggleGroup.Item
            className="choice"
            key={option}
            value={option}
            aria-label={caption}
          >
            <Icon className="choice-icon" strokeWidth={1.3} size={36} />
            <span className="choice-copy">
              <strong>{caption}</strong>
              {description && <small>{description}</small>}
            </span>
            <span className="choice-check" aria-hidden="true">
              <Check size={11} />
            </span>
          </ToggleGroup.Item>
        ),
      )}
    </ToggleGroup.Root>
  );
}
export function Pill({ children }: { children: ReactNode }) {
  return <span className="pill">{children}</span>;
}
