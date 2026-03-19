import React from "react";
import { ArrowUp, Square } from "lucide-react";
import { motion } from "framer-motion";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ── Auto-resizing Textarea ─────────────────────────────────────────── */

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none",
        className
      )}
      ref={ref}
      rows={1}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

/* ── PromptInput Context ────────────────────────────────────────────── */

interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number;
  onSubmit?: () => void;
  disabled?: boolean;
}

const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});

function usePromptInput() {
  return React.useContext(PromptInputContext);
}

/* ── PromptInput Wrapper ────────────────────────────────────────────── */

interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "rounded-2xl border border-cyan-400/40 bg-black/80 p-2 shadow-[0_0_20px_rgba(34,240,255,0.08)] transition-all duration-300",
            isLoading && "border-cyan-400/70 shadow-[0_0_30px_rgba(34,240,255,0.15)]",
            className
          )}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    );
  }
);
PromptInput.displayName = "PromptInput";

/* ── PromptInputTextarea ────────────────────────────────────────────── */

interface PromptInputTextareaProps
  extends Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange"> {
  placeholder?: string;
}

const PromptInputTextarea: React.FC<PromptInputTextareaProps> = ({
  className,
  onKeyDown,
  placeholder,
  ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      maxHeight
    )}px`;
  }, [value, maxHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-sm sm:text-base font-mono text-cyan-200 placeholder:text-cyan-400/40",
        className
      )}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

/* ── PromptInputActions ─────────────────────────────────────────────── */

const PromptInputActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

/* ── Main PromptInputBox ────────────────────────────────────────────── */

interface PromptInputBoxProps {
  onSend?: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  /** Extra content rendered in the actions bar (left side) */
  leftActions?: React.ReactNode;
}

export const PromptInputBox = React.forwardRef<
  HTMLDivElement,
  PromptInputBoxProps
>((props, ref) => {
  const {
    onSend = () => {},
    isLoading = false,
    placeholder = "TYPE COMMAND...",
    className,
    leftActions,
  } = props;
  const [input, setInput] = React.useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const hasContent = input.trim() !== "";

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className={cn(
        "w-full transition-all duration-300 ease-in-out",
        className
      )}
      disabled={isLoading}
      ref={ref}
    >
      <PromptInputTextarea placeholder={placeholder} />

      <PromptInputActions className="flex items-center justify-between gap-2 px-1 pt-1">
        <div className="flex items-center gap-1">{leftActions}</div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200",
            isLoading
              ? "bg-cyan-400/20 text-cyan-400"
              : hasContent
              ? "bg-cyan-400 text-black hover:bg-cyan-300"
              : "bg-transparent text-cyan-400/30 cursor-not-allowed"
          )}
          onClick={handleSubmit}
          disabled={isLoading || !hasContent}
          aria-label={isLoading ? "Stop generation" : "Send message"}
        >
          {isLoading ? (
            <Square className="h-4 w-4 fill-current animate-pulse" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </motion.button>
      </PromptInputActions>
    </PromptInput>
  );
});
PromptInputBox.displayName = "PromptInputBox";
