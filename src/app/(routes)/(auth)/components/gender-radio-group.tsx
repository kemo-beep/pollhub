import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const options = [
  { id: "male", label: "Male", value: false },
  { id: "female", label: "Female", value: true },
];

export function GenderRadioGroup({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      value={String(value)}
      onValueChange={(val) => onChange(val === "true")}
      disabled={disabled}
      className="grid grid-cols-2 gap-4"
    >
      {options.map((opt) => (
        <div
          key={opt.id}
          className={cn(
            "mt-2 flex items-center space-x-2 rounded-lg border px-4 py-3 ring-1 transition-all duration-200",
            value === opt.value
              ? "border-primary/20 bg-primary/5 ring-primary/10 text-foreground shadow-sm"
              : "border-border ring-transparent hover:border-primary/20 hover:bg-muted/50 text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <RadioGroupItem
            id={opt.id}
            value={String(opt.value)}
            disabled={disabled}
            className="peer sr-only"
          />
          <Label
            htmlFor={opt.id}
            className={cn(
              "mx-auto flex w-full cursor-pointer items-center justify-center text-sm font-medium transition-all duration-200",
              disabled && "cursor-not-allowed",
            )}
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
